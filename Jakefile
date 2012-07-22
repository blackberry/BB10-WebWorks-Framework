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
desc("run all native tests on device or sim - jake test [path,path2]");
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
desc("upload ssh key to device or sim - jake test [path,path2]");
task('upload-ssh-key', [], function () {
    require('./build/upload-ssh-key')(Array.prototype.slice.call(arguments));
});

desc("runs jshint + csslint - jake lint [path1] [path2]");
task('lint', [], function () {
    require('./build/lint')(Array.prototype.slice.call(arguments));
}, true);

desc("show various codebase stats");
task('stats', [], require('./build/stats'));
