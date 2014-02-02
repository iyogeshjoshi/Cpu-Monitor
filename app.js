var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongojs = require('mongojs');

var db = mongojs("mongodb://localhost/monitor",['cpus,freememory']);
cpucollection = db.collection('cpus');
freememorycollection = db.collection('freememory');
var statistics=[];
server.listen(3000);


app.use(require('express').static(__dirname));


app.get('/', function (req, res) {
//    res.send('Connected!');
    res.sendfile(__dirname + '/client/index.html');
});


io.sockets.on('connection', function (socket) {
    socket.emit('news', "Connected!");

    socket.on('CpuDetail', function (data) {
//        console.log(data);
//        cpucollection.save(data[0]);
//        cpucollection.save(data[0]);
            io.sockets.emit('cpuDetail', data);
    });
    socket.on('FreeMemory',function(data){
//        freememorycollection.save(data);
        io.sockets.emit('freeMemory',data);
    })
});

