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

describe("ui-resources/dialog", function () {

    var srcPath = '../../../../../',
    dialog = require(srcPath + 'ui-resources/plugins/dialog/index'),
    mockedController,
    mockedDomObject,
    mockedDomObjFunc,
    messageObj;

    beforeEach(function () {
        mockedDomObjFunc = function () {
            return this;
        };
        mockedController = {
            remoteExec: jasmine.createSpy()
        };
        mockedDomObject = {
            0 : true,
            addClass : function () {
                return this;
            },
            html : function () {
                return this;
            },
            hasClass : function () {
                return this;
            },
            bottom : function () {
                return this;
            },
            inner : function () {
                return this;
            },
            indexOf : function () {
                return this;
            },
            removeClass : function () {
                return this;
            },
            attr : function () {
                return this;
            },
            on : jasmine.createSpy().andReturn(this)
        };
        GLOBAL.x$ = function (args) {
            return mockedDomObject;
        };

        GLOBAL.window = {
            qnx : {
                webplatform : {
                    getController : function () {
                        return mockedController;
                    }
                }
            }
        };

        GLOBAL.document = {
            createTextNode: jasmine.createSpy(),
            createElement: jasmine.createSpy().andReturn({
                appendChild: jasmine.createSpy(),
                setAttribute: jasmine.createSpy(),
                addEventListener: jasmine.createSpy()
            })
        };
        GLOBAL.qnx = {
            callExtensionMethod: jasmine.createSpy("bond"),
            webplatform : {
                getController : function () {
                    return mockedController;
                }
            }
        };
    });

    it("has a showDialog function", function () {
        expect(dialog.showDialog).toBeDefined();
    });

    it("will not prompt a dialog on improper arguments", function () {
        messageObj = {};
        dialog.showDialog(messageObj);
        expect(x$().on).wasNotCalledWith('click', jasmine.any(Function));
    });

    it("can take a JavaScript Alert", function () {
        messageObj = {
                title : "Web Inspector",
                dialogType : "JavaScriptAlert",
                htmlmessage : 'This is a test alert'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Message without html and only message", function () {
        messageObj = {
                title : "Auth Challenege",
                dialogType : "AuthenticationChallenge",
                message : 'This is a test message',
                url : 'http://somewebsite.com'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Message with an OK label", function () {
        messageObj = {
                title : "Auth Challenege",
                dialogType : "JavaScriptAlert",
                message : 'This is a test message',
                oklabel : 'Test label'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Message with a cancel label", function () {
        messageObj = {
                title : "Auth Challenege",
                dialogType : "JavaScriptAlert",
                message : 'This is a test message',
                cancellabel : 'Can take a message with cancel label'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Message with a never label", function () {
        messageObj = {
                title : "Auth Challenege",
                dialogType : "JavaScriptAlert",
                message : 'This is a test message',
                neverlabel : 'Can take a message with cancel label'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });
    it("can take a JavaScript Confirm", function () {
        messageObj = {
                title : "JS Confirm",
                dialogType : "JavaScriptConfirm",
                htmlmessage : 'This is a test confirm'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Save Credential object", function () {
        messageObj = {
                title : "Save Credentials",
                dialogType : "SaveCredential",
                htmlmessage : 'This is a test credentials save'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Authentication Challenge object with http", function () {
        messageObj = {
                title : "Auth Challenege",
                dialogType : "AuthenticationChallenge",
                htmlmessage : 'This is a test challenge',
                url : 'http://somewebsite.com'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take a Authentication Challenge object with https", function () {
        messageObj = {
                title : "Auth Challenege",
                dialogType : "AuthenticationChallenge",
                htmlmessage : 'This is a test challenge',
                url : 'https://somewebsite.com'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it("can take InsecureSubresourceLoadPolicyConfirm object", function () {
        messageObj = {
                title : "InsecureSubresourceLoadPolicyConfirm",
                dialogType : "InsecureSubresourceLoadPolicyConfirm",
                htmlmessage : 'This is a test challenge'
            };

        dialog.showDialog(messageObj);
        expect(x$().on).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

});
