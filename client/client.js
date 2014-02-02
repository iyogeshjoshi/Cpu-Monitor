var server = require('socket.io-client').connect('http://192.168.2.106:3000');
var os = require('os');


server.on('connect', function () {
    console.log("connected!");
});

server.on('news', function (data) {
    console.log(data);
    setInterval(function () {
        var cpus = os.cpus();
        var totalProcess = 0;

        for(var i= 0, len = cpus.length;i<len;i++){
            var cpu = cpus[i], total = 0;
            for(type in cpu.times)
                total += cpu.times[type];

            for(type in cpu.times){
                cpus[i].times[type] = (100 * cpu.times[type]/total);
            }
        }
//        console.log(cpus[0]);
        var freeMemory = os.freemem();
        server.emit('CpuDetail', cpus);
        server.emit('FreeMemory', freeMemory);
    }, 5000);

})


