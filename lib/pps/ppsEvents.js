var _ppsUtils = require("./ppsUtils"), _event_ppsObj = {
    batterystatus: {
        path: "/pps/services/power/battery?wait,delta",
        mode: 0,
        fieldName: "StateOfCharge"
    }
};

module.exports = {
    addEventListener: function (eventType, trigger) {
        eventType = decodeURIComponent(eventType).replace(/\"/g, "");
        if (_event_ppsObj[eventType]) {
            _ppsUtils.init();
            _ppsUtils.onChange = function (data) {
                var fieldName = _event_ppsObj[eventType].fieldName, eventObj, readObj;
                if (data) {
                    eventObj = data["changed"];
                    if (eventObj) {
                        if (eventObj[fieldName]) {
                            readObj = _ppsUtils.read();
                            trigger(readObj[fieldName]);
                        }
                    }
                }
            };

            _ppsUtils.open(_event_ppsObj[eventType].path, _event_ppsObj[eventType].mode);
        }
    },
    removeEventListener: function (name) {
        if (_event_ppsObj.name) {
            _ppsUtils.close();
        }
    }
};