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

    drawChart();
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





