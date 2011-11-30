window.webworks = (function () {
    function RemoteFunctionCall(functionUri) {
        var postString = "",
            postParams = {};

        function composeUri() {
            return "http://localhost:4567/blackberry/" + functionUri;
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

            //TODO: we need to add makeSyncCall and based on sync param
            request.makeAsyncCall(success, fail);
        },
        successCallback: function (id, args) {
            //HACK: this will live later
        },
        errorCallback: function (id, args) {
            //HACK: this will live later
        }
    };
}());

(function bootstrap() {
    require.load('builder.js');
    var builder = require('builder'),
        request = new XMLHttpRequest();    
        
    request.open("GET", "http://localhost:8472/blackberry/extensions/get", true);
    
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var resp = JSON.parse(request.responseText);            
            builder.build(resp.data).into(window);
        }
    };    
    request.send(null);    
}());