module.exports = {
    start: function () {
        var express = require('express'),
        app = express.createServer();

        app.configure(function () {
            app.use(express.bodyParser());
            app.use(express.static(__dirname + '/public'));
        });

        //TODO: Fix this for connect
        app.post('/blackberry/:service/:action/:ext?/:method?', module.exports.handle);

        app.listen(4567);

        console.log('Server running at http://localhost:4567');
    },

    handle: function (req, res) {
        try {
            console.log("a");
            var plugin = require("./plugins/" + req.params.service);

            plugin[req.params.action](req, function (result) {
                res.send({
                    code: 1,
                    data: result
                }, 200);
            },
            function (error, code) {
                res.send({
                    code: Math.abs(code) * -1 || -1,
                    data: null,
                    msg: error
                }, 200);
            }, 
            req.body);
        }
        catch (e) {
            console.log(e);
            res.send("can't find the stuff", 404);
        }
    }
};
