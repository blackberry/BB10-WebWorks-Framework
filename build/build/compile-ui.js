/*
* Copyright 2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var wrench = require("../../node_modules/wrench"),
    fs = require("fs"),
    path = require("path"),
    util = require("./utils"),
    _c = require("./conf"),
    CSS_FILE = "/styles/chrome.css",
    HTML_FILE = "/chrome.html",
    JS_FILE = "/index.js",
    HTML_UI = "/ui.html",
    ASSETS = "/assets",
    tmpl = require("./tmpl");

module.exports = function (prev, baton) {
    var allPlugins,
        plugin,
        pluginsToLoad = [],
        pluginHTML,
        pluginHTMLPath,
        cssFiles = [path.join(_c.BUILD, 'FILE_LICENSE')],
        jsFiles = [],
        include = function (files, transform) {
            files = files.map ? files : [files];
            return files.map(function (file) {
                if (path.existsSync(file)) {
                    var str = fs.readFileSync(file, "utf-8") + "\n";
                    return transform ? transform(str, file) : str;
                } else {
                    return "";
                }
            }).join('\n');
        },
        outputHTML = "",
        outputCSS = "",
        outputJS = "",
        thirdParty = [path.join(_c.DEPENDENCIES, 'require/require.js')],
        assets = [],
        asset,
        template = { locals: {} },
        setupTemplate,
        uiFolderDest = path.join(_c.DEPLOY, 'ui-resources'),
        cssFolderDest = path.join(uiFolderDest, 'styles'),
        htmlDest = path.join(_c.DEPLOY_UI, 'ui.html'),
        cssDest = path.join(_c.DEPLOY_STYLES, 'styles.css'),
        jsDest = path.join(_c.DEPLOY_UI, 'index.js'),
        thirdPartyDest = path.join(_c.DEPLOY_UI, 'thirdparty'),
        assetsDest = path.join(_c.DEPLOY_UI, 'assets'),
        easset,
        eassets;

    // Read in all the possible ui plugins and set up templating for each
    allPlugins = fs.readdirSync(_c.UI_PLUGINS);

    setupTemplate = function (plugin, pluginHTML) {
        // Bind the values to the callback
        return function () {
            if (pluginsToLoad.indexOf(plugin) === -1) {
                pluginsToLoad.push(plugin);
            }
            return pluginHTML;
        };
    };

    for (plugin in allPlugins) {
        plugin = allPlugins[plugin];
        pluginHTMLPath = (path.normalize(_c.UI_PLUGINS + "/" + plugin + HTML_FILE));
        if (path.existsSync(pluginHTMLPath)) {
            pluginHTML = fs.readFileSync(pluginHTMLPath, "utf-8");
            template.locals[plugin] = setupTemplate(plugin, pluginHTML);    
        }
    }
   
    // Compile the ui.html with the template
    // This will also generate the list of plugins to load
    outputHTML = tmpl.render(fs.readFileSync(_c.UI + HTML_UI, "utf-8"), template); 
  
    // Prepare list of files needed for each plugin in use 
    pluginsToLoad.forEach(function (plugin) {
        // JS/CSS files are each compiled into a single file
        cssFiles.push(path.normalize(_c.UI_PLUGINS + "/" + plugin + CSS_FILE));
        jsFiles.push(path.normalize(_c.UI_PLUGINS + "/" + plugin + JS_FILE));
        var assetPath = path.normalize(_c.UI_PLUGINS + "/" + plugin + ASSETS);
        if (path.existsSync(assetPath)) {
            assets.push(assetPath);
        }
    });
   
    outputCSS = include(cssFiles);
    outputJS += include([path.join(_c.BUILD, 'FILE_LICENSE'), ]);
    outputJS += include(jsFiles, function (file, path) {
        var pathSplit = path.split("\/");
        return "define('" + pathSplit[pathSplit.length - 2] +
                       "', function (require, exports, module) {\n" + file + "});\n";
    });
    
    wrench.mkdirSyncRecursive(uiFolderDest, "0755");
    wrench.mkdirSyncRecursive(cssFolderDest, "0755");
    wrench.mkdirSyncRecursive(assetsDest, "0755");
    wrench.mkdirSyncRecursive(thirdPartyDest, "0755");
    for (plugin in thirdParty) {
        util.copyFile(thirdParty[plugin], thirdPartyDest);
    }

    for (asset in assets) {
        eassets = fs.readdirSync(assets[asset]);
        for (easset in eassets) {
            util.copyFile(path.normalize(assets[asset] + "/" + eassets[easset]), assetsDest);
        }
    } 
    
    fs.writeFileSync(cssDest, outputCSS); 
    fs.writeFileSync(jsDest, outputJS); 
    fs.writeFileSync(htmlDest, outputHTML); 
};
