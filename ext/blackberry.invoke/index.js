function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _event = requireLocal("lib/event"), 
    _ppsUtils = requireLocal("lib/pps/ppsUtils"),
    APP_URL_BROWSER = "http://",
    APP_TYPE_ERROR = "The application specified to invoke is not supported.",
    APP_BROWSER_ERROR = "Please specify a fully qualified URL that starts with either the 'http://' or 'https://' protocol.";

module.exports = {
    invoke: function (success, fail, args) {
        var argsObj, 
            path = "/pps/services", 
            mode = 2, 
            url, 
            PPSUtils,
            ctrlObj = {
                'id': "",
                'dat': null,
                'msg': "invoke"
            };

        switch (parseInt(args.appType, 10)) {
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
                        //Check if protocol is supported: http, https
                        if (url[0].toLowerCase() !== "http" && url[0].toLowerCase() !== "https") {
                            fail(APP_BROWSER_ERROR, -1);
                            return;
                        }                            

                        url = url[0].toLowerCase() + '://' + url[1];
                    }
                }
            } catch (e) {
                    url = APP_URL_BROWSER;
                }

            ctrlObj.dat = url;
            break;
        default:
            fail(APP_TYPE_ERROR, -1);
            return;
            
        }
        
        PPSUtils = _ppsUtils.createObject();
        
        PPSUtils.init();
        PPSUtils.open(path, mode);
        PPSUtils.write(ctrlObj);
        PPSUtils.close();
        
        success();
    }
};
