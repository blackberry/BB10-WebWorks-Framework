/*
 *  Copyright 2011 Research In Motion Limited.
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

var DESC_NEW_LINE = "\n\t\t      #";

desc("runs jake build");
task('default', [], require('./build/build'));

desc("package framework - jake build");
task('build', [], require('./build/build'));

desc("bundle webworks.js");
task('bundle', [], function () {
    require('./build/build/bundler').bundle();
});

desc("runs jake build cleaning native");
task('clean', [], require('./build/clean-native'));


desc("start server");
task('start', [], function () {
    require('./lib/server').start(process.argv);
});

desc("run all tests in node - jake test [path,path2]");
task('test', [], function () {
    require('./build/test')(null, process.argv.length >= 4 ? process.argv[3] : null);
});

desc("Grabs the latest ScreenShot from the device located at /accounts/1000/shared/camera/WebWorksScreenShot.bmp " +
    "/test/data/ReferenceImages/<name-of-file> [<ip address>,<name-of-file>]");
task('grab-image', [], function () {
    require('./build/grab-image')(Array.prototype.slice.call(arguments));
});

/**
 * Expected syntax is
 * jake native-test[<device|simulator>,<IP Address of device>,<comma seperated extensions to ignore>..]
 * eg.
 * To run tests on device with ip 192.10.235.20 and ignoring io.filetransfer extension use
 * jake native-test[device,192.10.235.20,io.filetransfer]
 * The default params are [device,169.254.0.1]
 * To run with default params use-
 * jake native-test
 *
 */
desc("run all native tests on device or sim - jake native-test [<device|simulator,<ip address>,<comma seperated filter list>]");
task('native-test', [], function () {
    require('./build/native-test')(Array.prototype.slice.call(arguments));
});


/**
 * Required jake native-test to avoid continous prompt of the password.
 * Expected syntax is
 * jake upload-ssh-key[<IP Address of device/simulator>, <Path to SSH Public key>
 * eg.
 * To upload ssh public key to device run 192.10.235.20 stored at ~/.ssh/id_rsa.pub use
 * jake upload-ssh-key[192.10.235.20,~/.ssh/id_rsa.pub]
 * default params are [169.254.0.1,~/.ssh/id_rsa.pub]
 * To run with default params use-
 * jake upload-ssh-key
 */
desc("upload ssh key to device or sim - jake upload-ssh-key[<ip address>,<path to ssh key>]");
task('upload-ssh-key', [], function () {
    require('./build/upload-ssh-key')(Array.prototype.slice.call(arguments));
});

desc("runs jshint + csslint - jake lint [path1] [path2]");
task('lint', [], function () {
    require('./build/lint')(Array.prototype.slice.call(arguments));
}, true);

desc("show various codebase stats");
task('stats', [], require('./build/stats'));

desc("Packages an app using the framework produced by this repo." + DESC_NEW_LINE +
     " This will replace the framework folder in the packager specified." + DESC_NEW_LINE +
     " This will replace webworks.js in the zip if you specify the path." + DESC_NEW_LINE +
     " The packager path MUST be absolute (ie no ~)" + DESC_NEW_LINE +
     " Expected usage - jake package[<pathToPackager>,<pathToAppZip>,<packagerOptions>,<{OPTIONAL}pathToWebWorks.js>]" + DESC_NEW_LINE +
     " Example - jake package[/Users/jheifets/Downloads/BB10webworks-next-42/,test/test-app/wwTest.zip,-d,js/webworks.js]");
task('package', [], require('./build/package'));

desc("Deploys a bar file to the given device/sim - jake deploy[<pathToBar>,<deviceIP>,<devicePassword>]");
task('deploy', [], require('./build/deploy'));

desc("Creates a zip of the test app - jake test-app");
task('test-app', [], require('./build/test-app'));

desc("Builds the framework, creates the test-app, packages it and deploys it" + DESC_NEW_LINE +
     " The packager path MUST be absolute (ie no ~)" + DESC_NEW_LINE +
     " Expected usage - jake deploy-tests[<pathToPackager>,<packageroptions>,<device|simulator>,<device ip>,<device password>]" + DESC_NEW_LINE +
     " Example - jake deploy-tests[/Users/jheifetz/Downloads/BB10webworks-next-42/,-d,device,169.254.0.1,qaqa]");
task("deploy-tests", [], require("./build/deploy-tests"));

desc("Deploys and runs QNX automation agents (internal only) - jake deploy-automation[<deviceIP>,<domainUserName>]");
task("deploy-automation", [], require("./build/deploy-automation"));
