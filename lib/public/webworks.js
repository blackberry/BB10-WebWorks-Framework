window.webworks = (function () {
    function RemoteFunctionCall(functionUri) {
        var postString = "",
            postParams = {};

        function composeUri() {
            return "http://localhost:4567/webworks/exec/" + functionUri;
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
        exec: function (success, fail, service, action, args) {
            var uri = service + "/" + action,
                request = new RemoteFunctionCall(uri),
                name;

            for (name in args) {
                if (Object.hasOwnProperty.call(args, name)) {
                    request.addPostParam(name, args[name]);
                }
            }

            request.makeAsyncCall(success, fail);
        }
    };
}());
