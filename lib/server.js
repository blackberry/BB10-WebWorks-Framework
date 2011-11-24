var Whitelist = require("./policy/whitelist").Whitelist;

module.exports = {
    start: function () {
        var express = require('express'),
        app = express.createServer();

        app.configure(function () {
            app.use(express.bodyParser());
            app.use(express.static(__dirname + '/public'));
        });

        app.post('/webworks/exec/:service/:action', module.exports.handle);

        // TODO should be post, use get to allow testing from browser
        app.get("/blackberry/exec/:featureId/:action", module.exports.handleFeature);

        app.listen(4567);

        console.log('Server running at http://localhost:4567');
    },

    handle: function (req, res) {
        try {
            var plugin = require("./plugins/" + req.params.service);

            plugin[req.params.action](function (result) {
                res.send({
                    code: 1,
                    data: result
                });
            },
            function (error) {
                res.send({
                    code: -1,
                    data: null,
                    msg: error
                });
            }, req.body);
        }
        catch (e) {
            console.log(e);
            res.send(404);
        }
    },

    handleFeature: function (req, res) {
        try {
            var whitelist = new Whitelist(),
                feature,
                // TODO protocol not available from req, assume "http" for now
                url = "http://" + req.headers.host + req.url;

            if (whitelist.isFeatureAllowed(url, req.params.featureId)) {
                // proceed to resolve feature after passing whitelist
                feature = require("./../ext/" + req.params.featureId + "/server.js");
                feature[req.params.action](function (result) {
                    res.send({
                        code: 1,
                        data: result
                    });
                },
                function (error) {
                    res.send({
                        code: -1,
                        data: null,
                        msg: error
                    });
                }, req.body);
            } else {
                res.send(403);
                console.log("\"" + req.params.featureId + "\" not whitelisted for this request");
            }
        }
        catch (e) {
            console.log(e);
            res.send(404);
        }
    }
};
