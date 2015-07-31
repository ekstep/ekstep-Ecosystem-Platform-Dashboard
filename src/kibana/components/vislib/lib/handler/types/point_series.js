define(function (require) {
  return function ColumnHandler(d3, Private) {
    var injectZeros = Private(require('components/vislib/components/zero_injection/inject_zeros'));
    var Handler = Private(require('components/vislib/lib/handler/handler'));
    var Data = Private(require('components/vislib/lib/data'));
    var Legend = Private(require('components/vislib/lib/legend'));
    var XAxis = Private(require('components/vislib/lib/x_axis'));
    var YAxis = Private(require('components/vislib/lib/y_axis'));
    var AxisTitle = Private(require('components/vislib/lib/axis_title'));
    var ChartTitle = Private(require('components/vislib/lib/chart_title'));
    var Alerts = Private(require('components/vislib/lib/alerts'));
    var SingleYAxisStrategy = Private(require('components/vislib/lib/_single_y_axis_strategy'));
    var DualYAxisStrategy = Private(require('components/vislib/lib/_dual_y_axis_strategy'));

    /*
     * Create handlers for Area, Column, and Line charts which
     * are all nearly the same minus a few details
     */
    function create(opts) {
      opts = opts || {};

      return function (vis) {
        var isUserDefinedYAxis = vis._attr.setYExtents;
        var data;
        var yAxisStrategy = vis._attr.hasSecondaryYAxis ? new DualYAxisStrategy() : new SingleYAxisStrategy();

        if (opts.zeroFill) {
          data = new Data(injectZeros(vis.data), vis._attr, yAxisStrategy);
        } else {
          data = new Data(vis.data, vis._attr, yAxisStrategy);
        }
        var handlerOpts = {
          data: data,
          legend: new Legend(vis, vis.el, data.labels, data.color, vis._attr),
          axisTitle: new AxisTitle(vis.el, data.get('xAxisLabel'), data.get('yAxisLabel')),
          chartTitle: new ChartTitle(vis.el),
          xAxis: new XAxis({
            el                : vis.el,
            xValues           : data.xValues(),
            ordered           : data.get('ordered'),
            xAxisFormatter    : data.get('xAxisFormatter'),
            expandLastBucket  : opts.expandLastBucket,
            _attr             : vis._attr
          }),
          alerts: new Alerts(vis, data, opts.alerts),
          yAxis: new YAxis({
            el   : vis.el,
            yMin : isUserDefinedYAxis ? vis._attr.yAxis.min : data.getYMin(),
            yMax : isUserDefinedYAxis ? vis._attr.yAxis.max : data.getYMax(),
            yAxisFormatter: data.get('yAxisFormatter'),
            _attr: vis._attr,
            orientation: 'left',
            yAxisDiv: 'y-axis-div'
          }),
          secondaryYAxis: new YAxis({})
        };
        if (vis._attr.hasSecondaryYAxis) {
          handlerOpts.secondaryYAxis = new YAxis({
            el    : vis.el,
            yMin  : data.getSecondYMin(),
            yMax  : data.getSecondYMax(),
            yAxisFormatter: data.get('secondYAxisFormatter'),
            _attr: vis._attr,
            orientation: 'right',
            yAxisDiv: 'secondary-y-axis-div'
          });
          handlerOpts.axisTitle = new AxisTitle(vis.el, data.get('xAxisLabel'), data.get('yAxisLabel'), data.get('secondYAxisLabel'));
        }
        return new Handler(vis, handlerOpts);
      };
    }

    return {
      line: create(),

      column: create({
        zeroFill: true,
        expandLastBucket: true
      }),

      area: create({
        zeroFill: true,
        alerts: [
          {
            type: 'warning',
            msg: 'Positive and negative values are not accurately represented by stacked ' +
                 'area charts. Either changing the chart mode to "overlay" or using a ' +
                 'bar chart is recommended.',
            test: function (vis, data) {
              if (!data.shouldBeStacked() || data.maxNumberOfSeries() < 2) return;
              var yAxisStrategy = vis._attr.multi_y ? new DualYAxisStrategy() : new SingleYAxisStrategy();
              var hasPos = data.getYMax(data._getY) > 0;
              var hasNeg = data.getYMin(data._getY) < 0;
              return (hasPos && hasNeg);
            }
          }
        ]
      })
    };
  };
});
