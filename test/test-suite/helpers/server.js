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
function Server() {
    this.start = function  () {
        var http = require('http');
        //process.send({ msg: 'start'});
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            var data = "",
                report;
            req.on("data", function (chunk) {
                data += chunk;
            });
            req.on("end", function () {
                report = JSON.parse(data);
                //console.log(report);
                process.nextTick(function () {
                    process.send({ msg: 'Response Received', response: report});
                });
                res.end('I am dummy page.\n');
            });
        }).listen(9644);
    };
    this.stop = function () {
        process.nextTick(function () {
            process.send({ msg: 'stop'});
            process.exit(0);
        });
    };
}

var server = new Server();

process.on('message', function (msg) {
    //console.log('The parent says: ', msg);
    server[msg.method]();
    process.nextTick(function () {
        process.send({ msg: 'Method ' + msg.method + ' called'});
    });
});

