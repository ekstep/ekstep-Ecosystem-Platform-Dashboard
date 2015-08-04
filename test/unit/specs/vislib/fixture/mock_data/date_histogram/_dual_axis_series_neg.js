define(function (require) {
  var moment = require('moment');

  return {
    'label': '',
    'xAxisLabel': '@timestamp per 30 sec',
    'ordered': {
      'date': true,
      'min': 1411761457636,
      'max': 1411762357636,
      'interval': 30000
    },
    'yAxisLabel': 'Count of documents',
    'series': [
      {
        'onSecondaryYAxis': true,
        'values': [
          {
            'x': 1411761450000,
            'y': -4100
          },
          {
            'x': 1411761480000,
            'y': -1800
          },
          {
            'x': 1411761510000,
            'y': -2200
          },
          {
            'x': 1411761540000,
            'y': -1700
          },
          {
            'x': 1411761570000,
            'y': -1700
          },
          {
            'x': 1411761600000,
            'y': -2100
          },
          {
            'x': 1411761630000,
            'y': -1600
          },
          {
            'x': 1411761660000,
            'y': -1700
          },
          {
            'x': 1411761690000,
            'y': -1500
          },
          {
            'x': 1411761720000,
            'y': -1900
          },
          {
            'x': 1411761750000,
            'y': -1100
          },
          {
            'x': 1411761780000,
            'y': -1300
          },
          {
            'x': 1411761810000,
            'y': -2400
          },
          {
            'x': 1411761840000,
            'y': -2000
          },
          {
            'x': 1411761870000,
            'y': -2000
          },
          {
            'x': 1411761900000,
            'y': -2100
          },
          {
            'x': 1411761930000,
            'y': -1700
          },
          {
            'x': 1411761960000,
            'y': -2000
          },
          {
            'x': 1411761990000,
            'y': -1300
          },
          {
            'x': 1411762020000,
            'y': -1400
          },
          {
            'x': 1411762050000,
            'y': -2500
          },
          {
            'x': 1411762080000,
            'y': -1700
          },
          {
            'x': 1411762110000,
            'y': -1400
          },
          {
            'x': 1411762140000,
            'y': -2200
          },
          {
            'x': 1411762170000,
            'y': -1400
          },
          {
            'x': 1411762200000,
            'y': -1900
          },
          {
            'x': 1411762230000,
            'y': -2200
          },
          {
            'x': 1411762260000,
            'y': -1700
          },
          {
            'x': 1411762290000,
            'y': -800
          },
          {
            'x': 1411762320000,
            'y': -1500
          },
          {
            'x': 1411762350000,
            'y': -400
          }
        ]
      },
      {
        'onSecondaryYAxis': false,
        'values': [
          {
            'x': 1411761450000,
            'y': -41
          },
          {
            'x': 1411761480000,
            'y': -18
          },
          {
            'x': 1411761510000,
            'y': -22
          },
          {
            'x': 1411761540000,
            'y': -17
          },
          {
            'x': 1411761570000,
            'y': -17
          },
          {
            'x': 1411761600000,
            'y': -21
          },
          {
            'x': 1411761630000,
            'y': -16
          },
          {
            'x': 1411761660000,
            'y': -17
          },
          {
            'x': 1411761690000,
            'y': -15
          },
          {
            'x': 1411761720000,
            'y': -19
          },
          {
            'x': 1411761750000,
            'y': -11
          },
          {
            'x': 1411761780000,
            'y': -13
          },
          {
            'x': 1411761810000,
            'y': -24
          },
          {
            'x': 1411761840000,
            'y': -20
          },
          {
            'x': 1411761870000,
            'y': -20
          },
          {
            'x': 1411761900000,
            'y': -21
          },
          {
            'x': 1411761930000,
            'y': -17
          },
          {
            'x': 1411761960000,
            'y': -20
          },
          {
            'x': 1411761990000,
            'y': -13
          },
          {
            'x': 1411762020000,
            'y': -14
          },
          {
            'x': 1411762050000,
            'y': -25
          },
          {
            'x': 1411762080000,
            'y': -17
          },
          {
            'x': 1411762110000,
            'y': -14
          },
          {
            'x': 1411762140000,
            'y': -22
          },
          {
            'x': 1411762170000,
            'y': -14
          },
          {
            'x': 1411762200000,
            'y': -19
          },
          {
            'x': 1411762230000,
            'y': -22
          },
          {
            'x': 1411762260000,
            'y': -17
          },
          {
            'x': 1411762290000,
            'y': -8
          },
          {
            'x': 1411762320000,
            'y': -15
          },
          {
            'x': 1411762350000,
            'y': -4
          }
        ]
      }
    ],
    'hits': 533,
    'xAxisFormatter': function (thing) {
      return moment(thing);
    },
    'tooltipFormatter': function (d) {
      return d;
    }
  };
});
