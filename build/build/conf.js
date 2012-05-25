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
var path = require("path");

module.exports = {
    ROOT: path.normalize(__dirname + "/../../"),
    DEPLOY: path.normalize(__dirname + "/../../target/zip/"),
    DEPLOY_UI: path.normalize(__dirname + "/../../target/zip/ui-resources/"),
    DEPLOY_STYLES: path.normalize(__dirname + "/../../target/zip/ui-resources/styles/"),
    TARGET: path.normalize(__dirname + "/../../target/"),
    BUILD: path.normalize(__dirname + "/.."),
    CLIENTFILES: path.normalize(__dirname + "/../../clientFiles"),
    LIB: path.normalize(__dirname + "/../../lib"),
    EXT: path.normalize(__dirname + "/../../ext"),
    UI: path.normalize(__dirname + "/../../ui-resources"),
    UI_PLUGINS: path.normalize(__dirname + "/../../ui-resources/plugins"),
    DEPENDENCIES: path.normalize(__dirname + "/../../dependencies"),
    DEPENDENCIES_BOOTSTRAP: path.normalize(__dirname + "/../../dependencies/bootstrap"),
    DEPENDENCIES_WEBPLATFORM_FRAMEWORK_LIB: path.normalize(__dirname + "/../../dependencies/webplatform/framework/clientFiles/webplatform.js"),
    DEPENDENCIES_WEBPLATFORM_FRAMEWORK_REQUIRE: path.normalize(__dirname + "/../../dependencies/require/require.js"),
    DEPENDENCIES_CONFIGURE_QSK: path.normalize(__dirname + "/../../dependencies/configure-qsk/configure-qsk"),
    NODE_MOD: path.normalize(__dirname + "/../../node_modules"),
    COMPILER_THREADS: "4"
};
