module.exports = {
    handle: function (req, res) {
        try {
            var plugin = require("./plugins/" + req.params.service);

            plugin[req.params.action](req, function (result) {
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
            req.body);
        }
        catch (e) {
            console.log(e);
            res.send(404, "can't find the stuff");
        }
    }
};
