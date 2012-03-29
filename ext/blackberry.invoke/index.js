function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _event = requireLocal("lib/event"), 
    PPSUtilsModule = requireLocal("lib/pps/ppsUtils"),
    APP_URL_BROWSER = "http://",
    APP_TYPE_ERROR = "The application specified to invoke is not supported.",
    APP_BROWSER_ERROR = "Please specify a fully qualified URL that starts with either the 'http://' or 'https://' protocol.";

module.exports = {
    invoke: function (success, fail, args) {
        var argsObj, 
            path = "/pps/services", 
            mode = 2, 
            url, 
            PPSUtilsInstance,
            ctrlObj = {
                'id': "",
                'dat': null,
                'msg': "invoke"
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
            
            try {
                argsObj = JSON.parse(decodeURIComponent(args.args));
                
                if (!argsObj || !argsObj.url) {
                    url = APP_URL_BROWSER;
                }                       
                else {
                    url = argsObj.url.split("://");
                    
                    //No protocol given, append http protocol
                    if (url.length === 1) {
                        url = APP_URL_BROWSER + url[0];
                    }
                    else if (url.length === 2) {
                        url = url[0].toLowerCase() + '://' + url[1];
                        
                        //Check if protocol is supported: http, https
                        if (url.indexOf("http") !== 0) {
                            fail(APP_BROWSER_ERROR, -1);
                        }                            
                    }
                }
            } catch (e) {
                    url = APP_URL_BROWSER;
                }

            ctrlObj.dat = url;
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
            fail(APP_TYPE_ERROR, -1);
        }
        
        PPSUtilsInstance = PPSUtilsModule.pps();
        
        PPSUtilsInstance.init();
        PPSUtilsInstance.open(path, mode);
        PPSUtilsInstance.write(ctrlObj);
        PPSUtilsInstance.close();
        success();
    }
};
