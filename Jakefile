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

desc("runs jshint + csslint - jake lint [path1] [path2]");
task('lint', [], function () {
    require('./build/lint')(Array.prototype.slice.call(arguments));
}, true);

desc("show various codebase stats");
task('stats', [], require('./build/stats'));
