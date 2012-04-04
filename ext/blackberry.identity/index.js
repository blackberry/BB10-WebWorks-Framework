function requireLocal(id) {
    return !!require.resolve ? require("../../" + id) : window.require(id);
}

var _ppsUtils = requireLocal("lib/pps/ppsUtils");

module.exports = {
    uuid: function (success, fail, args, env) {
        var PPSUtils = _ppsUtils.createObject(),
            deviceprops;

        PPSUtils.init();

        if (PPSUtils.open("/pps/services/private/deviceproperties", "0")) {
            deviceprops = PPSUtils.read();
        }

        PPSUtils.close();

        if (deviceprops) {
            success(deviceprops.devicepin);
        } else {
            fail("Cannot open PPS object");
        }
    }
};