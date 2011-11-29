module.exports = {
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
