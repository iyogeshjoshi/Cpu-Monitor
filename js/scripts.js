window.onload = function () {
    var socket = io.connect('http://192.168.2.106:3000'),
        updateField = document.getElementById('stat');

    var IE = [25.4, 33.5, 10.2, 35.4]

    socket.emit('send', "send me data");
    socket.on('index', function (data) {
        alert('in index, data:' + data);
    })
    socket.on('cpuDetail', function (data) {
        var content = "<div class='row-fluid'>";
        data.forEach(function (item) {
            content += "<ul class='span5 well'><li> Model: " + item.model + "</li>" +
                "<li>Speed: " + item.speed + "</li>" +
                "<li>Times: <ul>" +
                "<li>User: " + item.times.user + "</li>" +
                "<li>nice: " + item.times.nice + "</li>" +
                "<li>Sys: " + item.times.sys + "</li>" +
                "<li>Idle: " + item.times.idle + "</li>" +
                "<li>Irq: " + item.times.irq + "</li>";
            content += "</ul></li></ul>";
        })
        content += "</div><br />";

        updateField.innerHTML = content;
    });

    socket.on('freeMemory',function(data){

    })

    //Graph Operations Highcharts

   /* Highcharts.setOptions({
        global: {
            useUTC: true
        }
    });*/

    /*Variables to set series in Highcharts for the respective times array in CPUS */
    var user = [0, 0, 0, 0, 0, 0, 0, 0],
        nice = [0, 0, 0, 0, 0, 0, 0, 0],
        sys = [0, 0, 0, 0, 0, 0, 0, 0],
        idle = [0, 0, 0, 0, 0, 0, 0, 0],
        irq = [0, 0, 0, 0, 0, 0, 0, 0];

    /*Chart For Displaying Graph of CPUS data only*/
    new Highcharts.Chart({
        chart: {
            renderTo: "IdleCycle",
            type: 'spline',
            borderWidth: 2,
            borderColor: '#ACACAC',
            borderRadius: 10,
            plotBorderWidth: 1,
            plotBorderColor: '#CCC',
            spacingBottom: 20,
            spacingRight: 20,
            /*animation: {
                duration: 1000,
                easing: 'swing'
            },*/
            events: {
                load: function () {
                    user = this.series[0];
                    nice = this.series[1];
                    sys = this.series[2];
                    idle = this.series[3];
                    irq = this.series[4];

                    socket.on('cpuDetail', function (data) {
                        user.addPoint(data[0].times.user, true, true);
                        nice.addPoint(data[0].times.nice, true, true);
                        sys.addPoint(data[0].times.sys, true, true);
                        idle.addPoint(data[0].times.idle, true, true);
                        irq.addPoint(data[0].times.irq, true, true);
                    })
                }
            }
        },
        title: {
            text: "CPUs Detail Graph",
            align: 'left'
        },
        subtitle: {
            text: 'shows cpus processes detail',
            align: 'left'
        },
        xAxis:{
            type: 'datetime',
            dateTimeLabelFormats:{
                second: '%H:%M',
                minute: '%H:%M',
                hour: '%H:%M'
            }
        },
        xAxis: {
            type: 'datetime',
            /*formatter: function () {
             return Highcharts.dateFormat('%H:%M:%S', this.value, true);
             },*/
            dataTimeLabelFormats: {
                second: '%H:%M',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M',
                week: '%H:%M',
                month: '%H:%M',
                year: '%H:%M'
            },
            gridLineDashStyle: 'dot',
            gridLineWidth: 1,
            tickInterval: 2,
//            minorTickInterval:1,
            lineWidth: 2,
            lineColor: '#92A8CD',
            tickWidth: 3,
            tickLength: 6,
            tickColor: '#92A8CD'
        },
        yAxis: {
            title: {
                text: 'Percentage %'
            },
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0) + ' %';
                }
            },
            lineWidth: 2,
            lineColor: '#92A8CD',
            tickWidth: 2,
            tickLength: 6,
            minorTickWidth: 2,
            minorTickLength: 4,
            minorTickColor: '#D8D8D8',
//            tickInterval: 0.5,
//            minorTickInterval: 0.25,
            minorGridLineColor: "#ADADAD",
            minorGridLineDashStyle: 'dashdot',
            gridLineColor: '#8AB8E6',
//            min: 0,
//            max: 100
        },
        legend: {
            enabled: true
        },
        credits: {
            enabled: false
        },
        series: [
            {
                name: 'User Details',
                marker: {
                    enabled: false
                },
                data: user

            },
            {
                name: 'Nice Details',
                marker: {
                    enabled: false
                },
                data: nice

            },
            {
                name: 'System Details',
                marker: {
                    enabled: false
                },
                data: sys
            },
            {
                name: 'Idle Processes',
                marker: {
                    enabled: false
                },
                data: idle
            },
            {
                name: 'IRQ',
                marker: {
                    enabled: false
                },
                data: irq
            }
        ]

    });

    var freeMem = [0, 0, 0, 0, 0, 0, 0, 0];    //free memory array to initialize data in series of this graph
    var xTime = [0];
    //initialize to set the number of intervals in xAxis

    /*Graph to Display Amount of free memory on client pc*/
    new Highcharts.Chart({
        chart: {
            renderTo: "freemem",
            type: 'spline',
            borderWidth: 2,
            borderColor: '#ACACAC',
            borderRadius: 10,
            plotBorderWidth: 1,
            plotBorderColor: '#CCC',
            spacingBottom: 20,
            spacingRight: 20,
            /*animation: {
                duration: 1000,
                easing: 'swing'
            },*/
            events: {
                load: function () {
                    series1 = this.series[0];
                    xTime = this.xAxis.category;
                    socket.on('freeMemory', function (data) {
                        series1.addPoint(data, true, true);
                    });
                }
            }
        },
        title: {
            text: "Free Memory Graph",
            align: 'left'
        },
        subtitle: {
            text: 'free memory in MBs.',
            align: 'left'
        },
        xAxis: {
            type: 'datetime',
            dataTimeLabelFormats: {
                second: '%H:%M',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%H:%M',
                week: '%H:%M',
                month: '%H:%M',
                year: '%H:%M'
            },
            gridLineDashStyle: 'dot',
            gridLineWidth: 1,
            tickInterval: 2,
            lineWidth: 2,
            lineColor: '#92A8CD',
            tickWidth: 4,
            tickLength: 6,
            tickColor: '#92A8CD'
        },
        yAxis: {
            title: {
                text: 'y-axis title'
            },
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat((this.value / (1024 * 1024)), 2) + ' MB';
                }
            },
            lineWidth: 2,
            lineColor: '#92A8CD',
            tickWidth: 2,
            tickLength: 6,
            minorTickWidth: 2,
            minorTickLength: 4,
            minorTickColor: '#D8D8D8',
            minorGridLineColor: "#ADADAD",
            minorGridLineDashStyle: 'dashdot',
            gridLineColor: '#8AB8E6'
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [
            {
                name: 'Free memomy',
                marker: {
                    enabled: false
                },
                data: freeMem

            }
        ]

    });

};


