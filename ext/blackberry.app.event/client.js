var success = function (data, response) {
        console.log('success callback: ' + data);
    },
    error = function (data, response) {
        console.log('failure callback: ' + data);
    };

module.exports = {
    onExit: function () {        
        return window.webworks.exec(success, error, "blackberry.app.event", "onExit");
    }    
};
