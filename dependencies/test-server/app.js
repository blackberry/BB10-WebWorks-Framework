/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var http = require('http'),
    express = require('express'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();
    app = express.createServer(),
    job = require('./job');
  
app.configure(function() {
    app.use(express.bodyParser())
    app.use(express.static(__dirname + '/public'))
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
});


app.get('/run', function(req, res) {
    job.run(null, function (err) {
        if (err) {
            console.log('ERROR: ' + err);
            res.send(err);
        } else {
            eventEmitter.on('results', function(message){
                console.log(message);
                res.send(message);
            })
        }
    });
});

app.get('/run/:job', function(req, res) {
    job.run(req.params.job, function (err) {
        if (err) {
            console.log('ERROR: ' + err);
            res.send(err);
        } else {
            eventEmitter.on('results', function(message){
                console.log(message);
                res.send(message);
            })
        }
    });
});

app.post('/results', function(req, res) {
    console.log(req.body);
    if (req.body) {
        console.log(req);
        eventEmitter.emit('results', req.body);
        res.send('OK');
    }
});


var port = 3000;
app.listen(port);

console.log('Server now listening on port ' + port);