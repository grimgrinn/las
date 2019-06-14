// var lasparser = require(['lasreader.js'], function(e) {
//     console.log(e);
//     var onLasLoaded = function(lasObject) {
//         console.log(lasObject);
//         console.log(lasObject.getPointData(0));
//     };
//
//     document.getElementById('file').onchange = function() {
//         e.lasLoader(this.files[0], onLasLoaded);
//     };
// });

var fr = new FileReader();

document.getElementById('file').onchange = function() {
    fr.readAsText(this.files[0]);
};

var header = [];
var data = [];
var curves = [];

fr.onload = function () {
    var strings = fr.result.split("\n");
    var dataflag = false;
    var curvesflag = false;
    for (var i = 0; i < strings.length; ++i) {
        var str = strings[i].split(/\s+/);
        // console.log(str, i);
        if (!dataflag) {
            header.push(str);
        } else {
            str.shift();
            data.push(str);
            console.log(curves);
            var curvesKeys = Object.keys(curves);
            for (var j = 0; j < str.length; ++j) {
                curves[curvesKeys[j]].push(str[j]);
            }
        }

        if (curvesflag) {
            if (str[0].indexOf('#') < 0 && str[0].indexOf('~') < 0)
                curves[str[0]] = [];
        }

        if (str[0] && str[0].indexOf('~A') === 0) {
            dataflag = true;
            curvesflag = false;
        }
        if (str[0] && str[0].indexOf('~C') === 0) {
            curvesflag = true;
        }
    }

    console.log(header);
    console.log(curves);
    console.log(data);

    // drawChart();
    // drawChartOwn();
    drawChartPlotly();
    // console.log(fr.result.split("\n"));
    // var lasobject = lasreader(fr.result);
    // console.log(lasobject);
    // console.log(lasobject.header);
};

function drawChart() {
    var ctx = document.getElementById('graph').getContext('2d');
    ctx.rotate(90 * Math.PI / 180)
    var k = Object.keys(curves);
    var chart = new Chart(ctx, {
        type: 'line',
        options: {

        },
        data: {
            labels: curves[k[0]],
            datasets: [
                {
                    label: k[1],
                    data: curves[k[1]]
                },
                {
                    label: k[2],
                    data: curves[k[2]]
                },
                {
                    label: k[3],
                    data: curves[k[3]]
                },
                {
                    label: k[4],
                    data: curves[k[4]]
                }
            ]
        }
    })
};

// var graph = new LineGraph(300,2000, {
//     consumptionSpeed: {
//         colour: '#FF0000',
//         values: [
//             0,0,0,0,0,
//             0,0,0,0.1,0.3,
//             0.8,1,3,8,16,32
//         ]
//     },
//     temperature: {
//         color: '#0000FF',
//         values: [
//             80,80,80,80,80,
//             79,78,76,72,60,
//             55,54,40,10,0,0
//         ]
//     }
// });


function drawChartOwn() {
    var k = Object.keys(curves);
    var graph = new LineGraph(300,2000, {
        xAxis : {
            colour: '#FF0000',
            values: curves[k[0]]
        },
        yAxis : {
            color: '#0000FF',
            values: curves[k[1]]
        }
    });

    var canvas = graph.getCanvasElement();
    document.body.appendChild(canvas);
    graph.renderGraph();
}
//
//
// var tester = document.getElementById('tester');
// Plotly.plot( tester, [{
//     x: [1, 2, 3, 4, 5],
//     y: [1, 2, 4, 8, 16] }], {
//     margin: { t: 0 } } );


function drawChartPlotly() {

    var k = Object.keys(curves);
    var depths = curves[k[0]];
    var mnemonica = curves[k[1]];
    var mnemonicaName = k[1];

    var minValMnemonica = Math.min.apply(Math, mnemonica),
        maxValMnemonica = Math.max.apply(Math, mnemonica),
        minValDepth = Math.min.apply(Math, depths),
        maxValDepth = Math.max.apply(Math, depths);


    var trace1 = {
        x: mnemonica,
        y: depths,
        mode: 'lines',
        fillcolor: '#b30000',
        line: {
            color: '#333'
        }
    };

    var layout = {
        title: mnemonicaName,
        autosize: true,
        xaxis: {
            range: [minValMnemonica, maxValMnemonica],
            showgrid: true,
            showline: true,
            mirror: 'ticks',
            gridcolor: '#bdbdbd',
            gridwidth: 1,
            side: 'top'
        },
        yaxis: {range: [maxValDepth, minValDepth],
            showgrid: true,
            showline: true,
            mirror: 'ticks',
            gridcolor: '#bdbdbd',
            gridwidth: 1
        }
    }

    var data = [trace1];

    Plotly.newPlot('plotly', data, layout);
}








