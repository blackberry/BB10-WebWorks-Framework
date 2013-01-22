/*
 *  Copyright 2012 Research In Motion Limited.
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
var childProcess = require("child_process"),
    path = require("path"),
    sys = require("sys"),
    CLITest;

CLITest = function () {
    this.option = [];

    this.log_ = [];
    this.specResults = [];
    this.columnCounter_ = 0;
    this.start_         = 0;
    this.elapsed_       = 0;
    this.suites_        = 0;
    this.assertions_    = 0;
    this.failures_      = 0;

    this.execCmd = function (cmd, done) {
        console.log("EXECUTING " + cmd);
        var c = childProcess.exec(cmd, function (error, stdout, stderr) {
            done();
        });
        c.stdout.on('data', function (data) {
            console.log(data);
        });

        c.stderr.on('data', function (data) {
            console.log(data);
        });
    };

    this.addOption = function (name, value) {
        this.option.push(name + " " + (value || ""));
    };
    this.run = function (packager, done) {
        var cmd = this.option.reduce(function (previousValue, currentValue, index, array) {
            return (index === 0 ? "" : " ") + previousValue + " " + currentValue;
        }, "node " + path.join(packager, "lib", "bbwp.js"));
        this.execCmd(cmd, done);
        this.option = [];
    };

    this.reportRunnerStarting = function (name) {
        sys.print('Started ' + name);
        sys.print('\n');
        this.start_ = new Date();
    };

    this.reportRunnerFinished = function (name, runner) {
        var currentElaped = ((new Date() - this.start_) / 1000);

        this.elapsed_ += currentElaped;
        this.suites_ += runner.suites.length;
        this.assertions_ += runner.results.totalCount;
        this.failures_ += runner.results.failedCount;

        sys.print('\n');
        sys.print('Finished ' + name + ' in ' + currentElaped + ' seconds');
        sys.print('\n');
        sys.print('\n');
        sys.print('\n');
    };

    this.reportFinalResults = function () {
        var summary = '';

        sys.print('\n');
        sys.print('\n');

        sys.print('Repeat of final results');
        sys.print('\n');
        this.columnCounter_ = 0;
        this.specResults.forEach(function (result) {
            sys.print(result);
            if (this.columnCounter_++ === 50) {
                this.columnCounter_ = 0;
                sys.print('\n');
            }
        });
        sys.print('\n');
        sys.print('\n');

        this.log_.forEach(function(entry) {
            if (typeof entry === "string" && entry.length) {
                sys.print(entry);
                sys.print('\n');
            }
        });

        sys.print('Finished all suites in ' + this.elapsed_ + ' seconds ');

        summary += this.suites_ + ' test' + ((this.suites_.length === 1) ? '' : 's') + ', ';
        summary += this.assertions_ + ' assertion' + ((this.assertions_ === 1) ? '' : 's') + ', ';
        summary += this.failures_ + ' failure' + ((this.failures_ === 1) ? '' : 's') + '\n';
        sys.print(summary);
        sys.print('\n');
    };

    this.reportSpecResults = function (spec) {
        var result = spec.results,
            msg = '';

        if (result.passedCount === result.totalCount) {
            msg = ".";
            //      } else if (result.skipped) {  TODO: Research why "result.skipped" returns false when "xit" is called on a spec?
            //        msg = (colors) ? (ansi.yellow + '*' + ansi.none) : '*';
        } else {
            msg = 'F';
        }

        this.specResults.push(msg);
        sys.print(msg);

        if (this.columnCounter_++ === 50) {
            this.columnCounter_ = 0;
            sys.print('\n');
        }
    };

    this.reportSuiteResults = function (suite) {
        var specResults = suite.results,
            path = [],
            description;

        while(suite) {
            path.unshift(suite.description);
            suite = suite.parentSuite;
        }

        description = path.join(' ');

        outerThis = this;
        specResults.items_.forEach(function(spec){
            if (spec.failedCount > 0 && spec.description) {
                outerThis.log_.push('  it ' + spec.description);
                spec.items_.forEach(function(result){
                    if (result.trace && result.trace.stack) {
                        outerThis.log_.push('  ' + result.trace.stack + '\n');
                    }
                });
            }
        });
    };
};
module.exports = new CLITest();
