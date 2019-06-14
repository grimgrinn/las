function Graph(width, height, initialDataSource) {
    this.setDataSource(initialDataSource);
    this.initCanvas(width, height);
}

Graph.prototype.initCanvas = function (width, height) {
  this._canvas = document.createElement('canvas');
  this._context = this._canvas.getContext('2d');
  this.setSize(width, height);
};

Graph.prototype.setSize = function (width, height) {
    this._canvas.width = this._width = width;
    this._canvas.height = this._height = height;
};

Graph.prototype.getCanvasElement = function() {
    return this._canvas;
};

Graph.prototype.setDataSource = function (dataSource) {
    this._dataSource = dataSource;
};

Graph.prototype.renderGraph = function () {
    this.clearCanvasElement();
    this.drawDataSourceOntoCanvasElement();
};

Graph.prototype.clearCanvasElement = function () {
  this._context.clearRect(0,0, this._width, this._height);
};

Graph.prototype.drawDataSourceOntoCanvasElement = function () {};

function LineGraph() {
    Graph.apply(this, arguments);
}

LineGraph.prototype = Object.create(Graph.prototype);

LineGraph.prototype.setDataSource = function (dataSource) {
    Graph.prototype.setDataSource.call(this, dataSource);
    this._values = this.getDataSourceItemValues();
    this.calculateDataSourceBounds();
};

LineGraph.prototype.getDataSourceItemValues = function () {
    var dataSource = this._dataSource;
    var values = [];
    var key;

    for(key in dataSource) {
        if (dataSource.hasOwnProperty(key)) {
            values.push(dataSource[key].values);
        }
    }
    return values;
};


LineGraph.prototype.calculateDataSourceBounds = function () {
    this._bounds = {
        x: this.getLargestDataSourceItemLength(),
        y: this.getLargestDataSourceItemValue()
    }
};

LineGraph.prototype.getLargestDataSourceItemLength = function () {
    var values = this._values;
    var length = values.length;
    var max = 0;
    var currentLength;
    var i;

    for(i = 0; i < length; ++i) {
        currentLength = values[i].length;

        if(currentLength > max) {
            max = currentLength;
        }
    }

    return max;
};

LineGraph.prototype.getLargestDataSourceItemValue = function () {
    var values = this._values;
    var length = values.length;
    var max = 0;
    var currentItem;
    var i;

    for(i = 0; i < length; ++i) {
        currentItem = Math.max.apply(Math, values[i]);

        if(currentItem > max) {
            max = currentItem;
        }
    }

    return max;
};

LineGraph.prototype.drawDataSourceOntoCanvasElement = function () {
  var dataSource = this._dataSource;
  var currentItem;
  var key;

  for(key in dataSource) {
      if(dataSource.hasOwnProperty(key)) {
          currentItem = dataSource[key];
          this.plotValuesOntoCanvasElement(currentItem);
      }
  }
};

LineGraph.prototype.plotValuesOntoCanvasElement = function (item) {
    console.log('plot');
  var context = this._context;
  var points = item.values;
  var length = points.length;
  var currentPosition;
  var previousPosition;
  var i;

  var radius = 2;
  var startAngle = 0;
  var endAngle = Math.PI * 2;

  context.save();
  context.fillStyle = context.strokeStyle = item.color;
  context.lineWidth = 2;

  for (i = 0; i < length; ++i) {
      previousPosition = currentPosition;
      currentPosition = this.calculatePositionForValue(i, points[i]);

      context.beginPath();
      context.arc(currentPosition.x, currentPosition.y, radius, startAngle, endAngle, false);
      context.fill();

      if(previousPosition) {
          context.moveTo(previousPosition.x, previousPosition.y);
          context.lineTo(currentPosition.x, currentPosition.y);
          context.stroke();
      }
  }

  context.restore();
};

LineGraph.prototype.calculatePositionForValue = function (column, value) {
  return {
      x: this._width / this._bounds.x * column,
      y: this._height - (this._height / this._bounds.y * value)
  }
};

