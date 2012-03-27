var http = require('http'),
    express = require('express'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();
    app = express.createServer(),
    job = require('./lib/job');
  
app.configure(function() {
    app.use(express.bodyParser())
    app.use(express.static(__dirname + '/public'))
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
});

app.get('/hi', function(req, res) {
    // res.sendfile(__dirname + '/public/index.html');
    res.send("GET: /run/:job<br>GET: /run");
});

app.get('/run', function(req, res) {
    // generate index html file and inject the jasmine specs into <head>
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/run/:job', function(req, res) {
    // req.connection.setTimeout(1000);
    job.run(req.params.job, function (err) {
        if (err) {
            console.log('ERROR: ' + err);
            res.send(err);
        } else {
            eventEmitter.on('results', function(message){
                console.log(message);
                res.send(message);
            })
            //res.send(req.params.job);
        }
    });
});

app.post('/results', function(req, res) {
    console.log(req.body);
    if (req.body) {
        console.log(req);
        // pass results as response to /run/:job request
        // emit event
        eventEmitter.emit('results', req.body);
        res.send('OK');
    }
});

app.listen(3000);