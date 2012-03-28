function requireLocal(id) {
    id = id.replace(/local:\/\//, "").replace(/\.js$/, "");
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _event = requireLocal("lib/event"), _ppsUtils = requireLocal("lib/pps/ppsUtils"),
    APP_URL_BROWSER = "http://",
    APP_TYPE_ERROR = "The application specified to invoke is not supported.",
    APP_BROWSER_ERROR = "Please specify a fully qualified URL that starts with either the 'http://' or 'https://' protocol.";

module.exports = {
    invoke: function (success, fall, args) {
        var argsObj = JSON.parse(decodeURIComponent(args.args)), path = "/pps/services", mode = 2, url,
            ctrlObj = {
                'id': undefined,
                'obj': {
                    'id': "",
                    'dat': null,
                    'msg': "invoke"
                }
            };

        switch (parseInt(args.appType, 10)) {
            // Camera
        case 4:
            break;
        // Maps
        case 5:
            break;
        //Browser
        case 11:
            path += "/navigator/control?server";
            
            if (!argsObj) {
                url = APP_URL_BROWSER;
            }                       
            else {
                url = argsObj.url.split("://");
                
                //No protocol given, append http protocol
                if (url.length === 1) {
                    url = APP_URL_BROWSER + url[0];
                }
                else if (url.length === 2) {
                    
                    //Check if protocol is supported: http, https
                    if (url[0].indexOf("http") !== 0)
                        throw APP_BROWSER_ERROR;                                
                    
                    else {
                        url = argsObj.url;
                    }
                }
            }

            ctrlObj.obj.dat = url;
            break;
        // Music
        case 13:
            break;
        //Photos
        case 14:
            break;
        //Videos
        case 15:
            break;
        // AppWorld
        case 16:
            break;
        default:
            break;
        }

        _ppsUtils.init();
        _ppsUtils.open(path, mode);
        _ppsUtils.write(ctrlObj);
        _ppsUtils.close();
    }
};