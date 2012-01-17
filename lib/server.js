module.exports = {
    handle: function (req, res) {
        try {
            var plugin = require("./plugins/" + req.params.service),
                params = req.params.args && req.params.args.split("&"),
                args = {};

            if (params) {
                params.forEach(function (param) {
                    var parts = param.split("=");
                    args[parts[0]] = parts[1];
                });
            }

            plugin[req.params.action](req,
            function (result) {
                res.send(200, {
                    code: 1,
                    data: result
                });
            },
            function (error, code) {
                res.send(200, {
                    code: Math.abs(code) * -1 || -1,
                    data: null,
                    msg: error
                });
            },
            args);
        }
        catch (e) {
            console.log(e);
            res.send(404, "can't find the stuff");
        }
    }
};
