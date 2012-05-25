var define,
    require;

(function () {
    var unpreparedModules = {},
        readyModules = {};


    function normalizeName(originalName, baseName) {
        var nameParts,
            name = originalName.slice(0);
        //remove ^local:// (if it exists) and .js$
        //This will not work for local:// without a trailing js
        name = name.replace(/(?:^local:\/\/)?(.+?)(?:\.js$)/, "$1");
        if (name.charAt(0) === '.' && baseName) {
            //Split the baseName and remove the final part (the module name)
            nameParts = baseName.split('/');
            nameParts.pop();
            nameParts = nameParts.concat(name.split('/'));
            
            name = nameParts.reduce(function (previous, current,  index, array) {
                var returnValue,
                    slashIndex;

                //If previous is a dot, ignore it
                //If previous is ever just .. we're screwed anyway
                if (previous !== '.') {
                    returnValue = previous;
                }
                
                //If we have a .. then remove a chunk of previous
                if (current === "..") {
                    slashIndex = previous.lastIndexOf('/');
                    //If there's no slash we're either screwed or we remove the final token
                    if (slashIndex !== -1) {
                        returnValue = previous.slice(0, previous.lastIndexOf('/'));
                    } else {
                        returnValue = "";
                    }
                } else if (current !== '.') {
                    //Otherwise simply append anything not a .
                    //Only append a slash if we're not empty
                    if (returnValue.length) {
                        returnValue += "/";
                    }
                    returnValue += current;
                }

                return returnValue;
            });

        }
        return name;
    }

    function buildModule(name, dependencies, factory) {
        var module = {exports: {}},
            localRequire = function (moduleName) {
                return require(moduleName, name);
            },
            args = [];

        dependencies.forEach(function (dependency) {
            if (dependency === 'require') {
                args.push(localRequire);
            } else if (dependency === 'exports') {
                args.push(module.exports);
            } else if (dependency === 'module') {
                args.push(module);
            } else {
                //This is because jshint cannot handle out of order functions
                /*global loadModule:false */
                args.push(loadModule(dependency));
                /*global loadModule:true */
            }
        });

        //No need to process dependencies, webworks only has require, exports, module
        factory.apply(this, args);

        //For full AMD we would need logic to also check the return value
        return module.exports;

    }

    function loadModule(name, baseName) {
        var normalizedName = normalizeName(name, baseName),
            url,
            xhr,
            evalString;
        //Always check undefined first, this allows the user to redefine modules
        //(Not used in WebWorks, although it is used in our unit tests)
        if (unpreparedModules[normalizedName]) {
            readyModules[normalizedName] = buildModule(normalizedName, unpreparedModules[normalizedName].dependencies, unpreparedModules[normalizedName].factory);
            delete unpreparedModules[normalizedName];
        }

        //If the module does not exist, load the module from external source
        //Webworks currently only loads APIs from across bridge
        if (!readyModules[normalizedName]) {
            //If the module to be loaded ends in .js then we will define it
            //Also if baseName exists than we have a local require situation
            if (/\.js$/.test(name) || baseName) {
                xhr = new XMLHttpRequest();
                url = name;
                //If the module to be loaded starts with local:// go over the bridge
                //Else If the module to be loaded is a relative load it may not have .js extension which is needed
                if (/^local:\/\//.test(name)) {
                    url = "http://localhost:8472/blackberry/extensions/load/" + normalizedName.replace(/(?:^ext\/)(.+)(?:\/client$)/, "$1");
                } else if (baseName) {
                    url = normalizedName;
                    if (!/\.js$/.test(url)) {
                        url += ".js";
                    }
                }
                xhr.open("GET", url, false);
                xhr.send(null);
                try {
                    //Trimming responseText to remove EOF chars
                    evalString = 'define("' + normalizedName + '", function (require, exports, module) {' + xhr.responseText.replace(/^\s+|\s+$/g, '') + '});';
                    /*jshint evil:true */
                    eval(evalString);
                    /*jshint evil:false */
                } catch (err) {
                    err.message += ' in ' + url;
                    throw err;
                }

                if (unpreparedModules[normalizedName]) {
                    readyModules[normalizedName] = buildModule(normalizedName, unpreparedModules[normalizedName].dependencies, unpreparedModules[normalizedName].factory);
                    delete unpreparedModules[normalizedName];
                }
            } else {
                throw "module " + name + " cannot be found";
            }

        }

        return readyModules[normalizedName];

    }

    //Use the AMD signature incase we ever want to change.
    //For now we will only be using (name, baseName)
    require = function (dependencies, callback) {
        if (typeof dependencies === "string") {
            //dependencies is the module name and callback is the relName
            //relName is not part of the AMDJS spec, but we use it from localRequire
            return loadModule(dependencies, callback);
        } else if (Array.isArray(dependencies) && typeof callback === 'function') {
            //Call it Asynchronously
            setTimeout(function () {
                buildModule(undefined, dependencies, callback);
            }, 0);
        }
    }; 


    //Use the AMD signature incase we ever want to change.
    //For now webworks will only be using (name, factory) signature.
    define = function (name, dependencies, factory) {
        if (typeof name === "string" && typeof dependencies === 'function') {
            factory = dependencies;
            dependencies = ['require', 'exports', 'module'];
        }

        //According to the AMDJS spec we should parse out the require statments 
        //from factory.toString and add those to the list of dependencies

        //Normalize the name. Remove local:// and .js
        name = normalizeName(name);
        unpreparedModules[name] = {
            dependencies: dependencies,
            factory: factory
        }; 
    };
}());

//Export for use in node for unit tests
if (typeof module === "object" && typeof require === "function") {
    module.exports = {
        require: require,
        define: define
    };
}
