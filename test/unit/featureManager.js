/*
 * Copyright 2011 Research In Motion Limited.
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
var srcPath = __dirname + "/../../lib/",
    FeatureManager = require(srcPath + "policy/featureManager.js").FeatureManager;

describe("Feature manager", function () {
    it("can return a blank extension object if libraries contain no objects", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {}
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.blah"]);

        expect(ext).toBeDefined();
        expect(ext.id).toEqual("blackberry");
        expect(ext.objects).toEqual({});
    });

    it("can return correct extension object for bb.x", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "client1.js",
                        serverPath : "server1.js"
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.app"]);

        expect(ext.objects["app"]).toBeDefined();
        expect(ext.objects["app"].path).toBeDefined();
        expect(ext.objects["app"].path).toEqual("client1.js");
    });

    it("can return correct extension object for both bb.x and bb.x.y", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "ext/app/client.js",
                        serverPath : "ext/app/server.js",
                        children : {
                            "event" : {
                                clientPath : "ext/app_event/client.js",
                                serverPath : "ext/app_event/server.js"
                            }
                        }
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.app", "blackberry.app.event"]);

        expect(ext.objects["app"]).toBeDefined();
        expect(ext.objects["app"].path).toBeDefined();
        expect(ext.objects["app"].path).toEqual("ext/app/client.js");
        expect(ext.objects["app"].children).toBeDefined();
        expect(ext.objects["app"].children["event"]).toBeDefined();
        expect(ext.objects["app"].children["event"].path).toEqual("ext/app_event/client.js");
    });
	
    it("can return correct extension object for both bb.x and bb.x.y when bb.x.y appears before bb.x", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "ext/app/client.js",
                        serverPath : "ext/app/server.js",
                        children : {
                            "event" : {
                                clientPath : "ext/app_event/client.js",
                                serverPath : "ext/app_event/server.js"
                            }
                        }
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.app.event", "blackberry.app"]);

        expect(ext.objects["app"]).toBeDefined();
        expect(ext.objects["app"].path).toBeDefined();
        expect(ext.objects["app"].path).toEqual("ext/app/client.js");
        expect(ext.objects["app"].children).toBeDefined();
        expect(ext.objects["app"].children["event"]).toBeDefined();
        expect(ext.objects["app"].children["event"].path).toEqual("ext/app_event/client.js");
    });

    it("can return correct extension object for bb.x.y when bb.x is not whitelisted", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "ext/app/client.js",
                        serverPath : "ext/app/server.js",
                        children : {
                            "event" : {
                                clientPath : "ext/app_event/client.js",
                                serverPath : "ext/app_event/server.js"
                            }
                        }
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.app.event"]);

        expect(ext.objects["app"]).toBeDefined();
        expect(ext.objects["app"].path).not.toBeDefined();
        expect(ext.objects["app"].children).toBeDefined();
        expect(ext.objects["app"].children["event"]).toBeDefined();
        expect(ext.objects["app"].children["event"].path).toEqual("ext/app_event/client.js");
    });

    it("can return correct extension object for bb.x when bb.x.y is not whitelisted", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "ext/app/client.js",
                        serverPath : "ext/app/server.js",
                        children : {
                            "event" : {
                                clientPath : "ext/app_event/client.js",
                                serverPath : "ext/app_event/server.js"
                            }
                        }
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.app"]);

        expect(ext.objects["app"]).toBeDefined();
        expect(ext.objects["app"].path).toEqual("ext/app/client.js");
        expect(ext.objects["app"].children).not.toBeDefined();
    });

    it("can return a blank extension object if feature id does not start with \"blackberry.\"", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "client1",
                        serverPath : "",
                        children : {
                            "event" : {
                                clientPath : "client2",
                                serverPath : ""
                            }
                        }
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["cnn.news"]);

        expect(ext).toBeDefined();
        expect(ext.id).toEqual("blackberry");
        expect(ext.objects).toEqual({});
    });

    it("can return a correct extension object when feature array contains a feature id more than once", function () {
        var featureMgr = new FeatureManager({
                id : "blackberry",
                objects : {
                    "app" : {
                        clientPath : "ext/app/client.js",
                        serverPath : "ext/app/server.js",
                        children : {
                            "event" : {
                                clientPath : "ext/app_event/client.js",
                                serverPath : "ext/app_event/server.js"
                            }
                        }
                    }
                }
            }),
            ext = featureMgr.getExtensionsObjectForFeatures(["blackberry.app", "blackberry.app"]);

        expect(ext.objects["app"]).toBeDefined();
        expect(ext.objects["app"].path).toBeDefined();
        expect(ext.objects["app"].path).toEqual("ext/app/client.js");
    });
});
