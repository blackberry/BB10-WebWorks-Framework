module.exports = {
    start: function () {
        var express = require('express'),
        app = express.createServer();

        app.configure(function () {
            app.use(express.bodyParser());
            app.use(express.static(__dirname + '/public'));
        });

        app.post('/webworks/exec/:service/:action', module.exports.handle);

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
    }
};
