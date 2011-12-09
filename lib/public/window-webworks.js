window.webworks = (function () {
    function RemoteFunctionCall(functionUri) {
        var postString = "",
            postParams = {};

        function composeUri() {
            return "http://localhost:8472/blackberry/" + functionUri;
        }

        function createXhrRequest(uri, isAsync) {
            var request = new XMLHttpRequest(),
                paramCount = 1,
                param;

            for (param in postParams) {
                if (postParams.hasOwnProperty(param)) {
                    postString += param + "=" + postParams[param] + "&";
                    paramCount++;
                }
            }

            postString = postString.replace(/\&$/, "");

            // TODO: make get/post
            request.open("POST", uri, isAsync);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            return request;
        }

        this.addPostParam = function (name, value) {
            postParams[name] = encodeURIComponent(JSON.stringify(value));
        };

        this.makeSyncCall = function (success, error) {
            var requestUri = 'http://localhost/index.html',//composeUri(),
                request = createXhrRequest(requestUri, false),
                response, errored, cb, data;

            request.send(postString);

            response = JSON.parse(request.responseText || "null");
            errored = response.code < 0;
            cb = errored ? error : success;
            data = errored ? response.msg : response.data;

            if (cb) {
                cb(data, response);
            }
            else if (errored) {
                throw data;
            }

            return data;
        };

        this.makeAsyncCall = function (success, error) {
            var requestUri = composeUri(),
                request = createXhrRequest(requestUri, true);

            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    var response = JSON.parse(request.responseText || "null"),
                        cb = response.code < 0 ? error : success,
                        data = response.code < 0 ? response.msg : response.data;

                    return cb && cb(data, response);
                }
            };

            request.send(postString);
        };
    }

    var builder,
        request,
        _r;

    // aspect require
    _r = window.require;
    window.require = function (id) {
        id = id.replace(/^\.\.\/\.\.\//, "");
        id = id.replace(/^\.\//, "");
        if (_r.modules[id] === undefined) {
            _r.load({id: id, url: 'local://' + id + ".js"});
        }
        return _r.apply(null, arguments);
    };

    // bootstrap
    builder = require('builder');
    request = new XMLHttpRequest();

    request.open("GET", "http://localhost:8472/blackberry/extensions/get", true);

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var resp,
                evt;

            resp = JSON.parse(request.responseText);
            builder.build(resp.data).into(window);

            evt = document.createEvent("Events");
            evt.initEvent("deviceready", true, true);
            document.dispatchEvent(evt);
        }
    };
    request.send(null);

    return {
        exec: function (success, fail, service, action, args, sync) {
            var uri = "bridge/exec/" + service + "/" + action,
                request = new RemoteFunctionCall(uri),
                name;

            for (name in args) {
                if (Object.hasOwnProperty.call(args, name)) {
                    request.addPostParam(name, args[name]);
                }
            }

            request[sync ? "makeSyncCall" : "makeAsyncCall"](success, fail);
        },
        successCallback: function (id, args) {
            //HACK: this will live later
            throw "not implemented";
        },
        errorCallback: function (id, args) {
            //HACK: this will live later
            throw "not implemented";
        }
    };
}());