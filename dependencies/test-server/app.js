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
                res.send("Yay jasmine tests are done!");
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