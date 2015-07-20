define(function (require) {
  return function DualYAxisStrategyService(d3) {
    var _ = require('lodash');
    var DualYAxisStrategy = function () {
    };

    /**
     * Return an array of all value objects
     * Pluck the data.series array from each data object
     * Create an array of all the value objects from the series array
     *
     * @method flatten
     * @returns {Array} Value objects
     */
    DualYAxisStrategy.prototype._primaryAxisFlatten = function (chartData) {
      return _(chartData)
        .pluck('series')
        .flatten()
        .reject( function (series) {
          return series.onSecondaryYAxis;
        })
        .pluck('values')
        .flatten()
        .value();
    };

    DualYAxisStrategy.prototype._secondaryAxisFlatten = function (chartData) {
      return _(chartData)
        .pluck('series')
        .flatten()
        .filter( function (series) {
          return series.onSecondaryYAxis;
        })
        .pluck('values')
        .flatten()
        .value();
    };

    DualYAxisStrategy.prototype.decorate = function (data) {
      if (data.series) {
        _.map(data.series, function (series) {
          var onSecondaryYAxis = series.onSecondaryYAxis;
          _.map(series.values, function (value) {
            value.belongsToSecondaryYAxis = onSecondaryYAxis;
          });
        });
      }
      return data;
    };

    /**
     * Returns the max Y axis value for a `series` array based on
     * a specified callback function (calculation).
     * @param {function} [getValue] - Optional getter that will be used to read
     *                              values from points when calculating the extent.
     *                              default is either this._getYStack or this.getY
     *                              based on this.shouldBeStacked().
     */
    DualYAxisStrategy.prototype._getYExtent = function (chart, extent, getValue, attr, points) {
      return d3[extent](points);
    };

    /**
     * Calculates the highest Y value across all charts, taking
     * stacking into consideration.
     *
     * @method getYMax
     * @param {function} [getValue] - optional getter that will receive a
     *                              point and should return the value that should
     *                              be considered
     * @returns {Number} Max y axis value
     */
    DualYAxisStrategy.prototype.getYMax = function (getValue, chartData, attr) {
      var self = this;
      var arr = [];

      if (attr.mode === 'percentage') {
        return 1;
      }

      var flat = this._primaryAxisFlatten(chartData);
      // if there is only one data point and its less than zero,
      // return 0 as the yMax value.
      if (!flat.length || flat.length === 1 && flat[0].y < 0) {
        return 0;
      }

      var points = _(flat).pluck('y').value();

      var max = -Infinity;

      // for each object in the dataArray,
      // push the calculated y value to the initialized array (arr)
      _.each(chartData, function (chart) {
        var calculatedMax = self._getYExtent(chart, 'max', getValue, attr, points);
        if (!_.isUndefined(calculatedMax)) {
          max = Math.max(max, calculatedMax);
        }
      });

      return max;
    };


    DualYAxisStrategy.prototype.getSecondYMax = function (getValue, chartData, attr) {
      var self = this;
      var arr = [];

      if (attr.mode === 'percentage') {
        return 1;
      }

      var flat = this._secondaryAxisFlatten(chartData);
      // if there is only one data point and its less than zero,
      // return 0 as the yMax value.
      if (!flat.length || flat.length === 1 && flat[0].y < 0) {
        return 0;
      }

      var max = -Infinity;
      var points = _(flat).pluck('y').value();

      // for each object in the dataArray,
      // push the calculated y value to the initialized array (arr)
      _.each(chartData, function (chart) {
        var calculatedMax = self._getYExtent(chart, 'max', getValue, attr, points);
        if (!_.isUndefined(calculatedMax)) {
          max = Math.max(max, calculatedMax);
        }
      });

      return max;
    };

    DualYAxisStrategy.prototype.getYMin = function (getValue, chartData, attr) {
      var self = this;
      var arr = [];

      if (attr.mode === 'percentage' || attr.mode === 'wiggle' ||
        attr.mode === 'silhouette') {
        return 0;
      }

      var flat = this._primaryAxisFlatten(chartData);
      // if there is only one data point and its less than zero,
      // return 0 as the yMax value.
      if (!flat.length || flat.length === 1 && flat[0].y > 0) {
        return 0;
      }

      var min = Infinity;

      var points = _(flat).pluck('y').value();
      // for each object in the dataArray,
      // push the calculated y value to the initialized array (arr)
      _.each(chartData, function (chart) {
        var calculatedMin = self._getYExtent(chart, 'min', getValue, attr, points);
        if (!_.isUndefined(calculatedMin)) {
          min = Math.min(min, calculatedMin);
        }
      });

      return min;
    };

    DualYAxisStrategy.prototype.getSecondYMin = function (getValue, chartData, attr) {
      var self = this;
      var arr = [];

      if (attr.mode === 'percentage' || attr.mode === 'wiggle' ||
        attr.mode === 'silhouette') {
        return 0;
      }

      var flat = this._secondaryAxisFlatten(chartData);
      // if there is only one data point and its less than zero,
      // return 0 as the yMax value.
      if (!flat.length || flat.length === 1 && flat[0].y > 0) {
        return 0;
      }

      var min = Infinity;
      var points = _(flat).pluck('y').value();

      // for each object in the dataArray,
      // push the calculated y value to the initialized array (arr)
      _.each(chartData, function (chart) {
        var calculatedMin = self._getYExtent(chart, 'min', getValue, attr, points);
        if (!_.isUndefined(calculatedMin)) {
          min = Math.min(min, calculatedMin);
        }
      });

      return min;
    };
    return DualYAxisStrategy;
  };
});
