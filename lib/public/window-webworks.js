window.webworks = (function () {
    function RemoteFunctionCall(functionUri) {
        var paramString = "",
            params = {},
            isPost = false;

        function composeUri() {
            return "http://localhost:8472/blackberry/" + functionUri;
        }

        function createXhrRequest(uri, isAsync) {
            var request = new XMLHttpRequest(),
                paramCount = 1,
                param;

            for (param in params) {
                if (params.hasOwnProperty(param)) {
                    paramString += param + "=" + params[param] + "&";
                    paramCount++;
                }
            }

            paramString = paramString.replace(/\&$/, "");

            if (!isPost && paramString) {
                uri += "?" + paramString;
            }

            // TODO: make get/post
            request.open("GET", uri, isAsync);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            return request;
        }

        this.addParam = function (name, value) {
            params[name] = encodeURIComponent(JSON.stringify(value));
        };

        this.makeSyncCall = function (success, error) {
            var requestUri = composeUri(),
                request = createXhrRequest(requestUri, false),
                response, errored, cb, data;

            request.send(isPost ? paramString : null);

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

            request.send(isPost ? paramString : null);
        };
    }

    var builder,
        request,
        _r,
        execFunc;

    // aspect require
    _r = window.require;
    window.require = function (id) {
        id = id.replace(/^\.\.\/\.\.\//, "");
        return (_r.modules[id] ? false : _r.load({id: id, url: "http://localhost:8472/blackberry/extensions/load/" + id.replace("ext\/", "").replace("\/client", "")})) ||
            _r.apply(null, arguments);
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

    execFunc = function (success, fail, service, action, args, sync) {
        var uri = "bridge/exec/" + service + "/" + action,
            request = new RemoteFunctionCall(uri),
            name;

        for (name in args) {
            if (Object.hasOwnProperty.call(args, name)) {
                request.addParam(name, args[name]);
            }
        }

        request[sync ? "makeSyncCall" : "makeAsyncCall"](success, fail);
    };

    return {
        exec: execFunc,
        execSync: function (service, action, args) {
            var result;

            execFunc(function (data, response) {
                result = data;
            }, function (data, response) {
                throw data;
            }, service, action, args, true);

            return result;
        },
        execAsync: function (service, action, args) {
            var result;

            execFunc(function (data, response) {
                result = data;
            }, function (data, response) {
                throw data;
            }, service, action, args, false);

            return result;
        },
        successCallback: function (id, args) {
            //HACK: this will live later
            throw "not implemented";
        },
        errorCallback: function (id, args) {
            //HACK: this will live later
            throw "not implemented";
        },
        event: require("event")
    };
}());
