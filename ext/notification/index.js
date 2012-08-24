/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _config = require("./../../lib/config"),
    _event = require("./../../lib/event"),
    _pps = qnx.webplatform.pps,
    _ppsObject;

function getPPSForWrite(eventName) {
    if (!_ppsObject) {
        _ppsObject = _pps.create('/pps/services/notify/control', _pps.PPSMode.FULL);
        _ppsObject.onOpenFailed = function () {
            if (eventName) {
                _event.trigger(eventName, "PPS Open Failed");
            }
        };

        _ppsObject.open(_pps.FileMode.RDWR);
    }

    _ppsObject.onNewData = function (data) {
        if (data && data.control) {
            if (data.control.dat && data.control.dat.toLowerCase() === "ok") {
                _event.trigger(eventName);
            }
            else {
                _event.trigger(eventName, "PPS onNewData invoked with an error");
            }
        }
    };

    _ppsObject.onWriteFailed = function () {
        if (eventName) {
            _event.trigger(eventName, "PPS Write Failed");
        }
    };

    return _ppsObject;
}

module.exports = {
    notify: function (success, fail, args) {
        var key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                args[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        // Set the target if not provided in the options but appears in the config.xml
        // Set targetAction to default when there is target but no action.
        if (!args.options.target || args.options.target.length === 0) {
            for (key in _config['invoke-target']) {
                if (_config['invoke-target'].hasOwnProperty(key)) {
                    if (_config['invoke-target'][key].type.toLowerCase() === "application") {
                        args.options.target = _config['invoke-target'][key]["@"].id;
                    }
                }
            }
        }

        if ((args.options.target && args.options.target.length > 0) && (!args.options.targetAction || args.options.targetAction.length === 0)) {
            args.options.targetAction = "bb.action.OPEN";
        }

        // Calling delete with tag before writing new notification, ensures new notification will override the old one.
        getPPSForWrite().write({'msg': 'delete', dat: {'itemid': args.options.tag}});
        getPPSForWrite(args.options.eventName).write(
            {'msg': 'notify', 'id': args.id,
                dat: {'itemid': args.options.tag, "title": args.title, 'subtitle': args.options.body,
                      'target': args.options.target, 'targetAction': args.options.targetAction,
                      'payload': args.options.payload, 'payloadType': args.options.payloadType, 'payloadURI': args.options.payloadURI
                     }
            });

        success();
    },
    remove: function (success, fail, args) {
        var key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                args[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        getPPSForWrite().write({'msg': 'delete', dat: {'itemid': args.tag}});

        success();
    },
    close: function (success, fail, args) {
        var key;

        for (key in args) {
            if (args.hasOwnProperty(key)) {
                args[key] = JSON.parse(decodeURIComponent(args[key]));
            }
        }

        getPPSForWrite().write({'msg': 'delete', 'id': args.id, dat: {'itemid': args.tag}});

        success();
    }
};
