const scales = require('../lib/scales.js');
const should = require('chai').should();

describe('Work with weights.', () => {
  describe('Validating input.', () => {
    it('Correct with comma', () => {
      scales.validateWeight('55,22').should.equal(true);
    });

    it('Correct with dot', () => {
      scales.validateWeight('55.22').should.equal(true);
    });

    it('Correct short number', () => {
      scales.validateWeight('55').should.equal(true);
    });

    it('Incorrect string', () => {
      scales.validateWeight('55string').should.equal(false);
    });

    it('Empty value', () => {
      scales.validateWeight('').should.equal(false);
    });

    it('Value with new string', () => {
      scales.validateWeight('55\n').should.equal(true);
    });
  });

  it('Formatting confirmation', () => {
    const weightData = {
      date: 1600851631319,
      weight: 55
    };
    scales.formatConfirmation(weightData, 'kg').should.equal('20 of December is 55kg');
  });

  describe('Formatting last 7 measuring.', () => {
    const arrowUp = String.fromCodePoint(0x2191);
    const arrowDown = String.fromCodePoint(0x2193);
    it('No measurings', () => {
      const text = scales.formatLastMeasurings([], 'kg');
      text.should.equal('You have no weight measurings.');
    });

    it('1 measuring', () => {
      const weightData = [
        {
          date: 1600893882,
          weight: 1
        }
      ];
      const text = scales.formatLastMeasurings(weightData, 'kg');
      text.should.equal(
        'Your progress in 1 measure:\n\n' +
        '23 of September  --  1kg'
      );
    });

    it('2 measurings', () => {
      const weightData = [
        {
          date: 1600893882,
          weight: 1
        },
        {
          date: 1600893883,
          weight: 2
        }
      ];
      const text = scales.formatLastMeasurings(weightData, 'kg');
      text.should.equal(
        'Your progress in 2 measures:\n\n' +
        '23 of September  --  1kg\n' +
        '23 of September  --  2kg  ' + arrowUp
      );
    });

    it('7 measurings', () => {
      const weightData = [
        {
          date: 1600893882,
          weight: 1
        },
        {
          date: 1600893883,
          weight: 2
        },
        {
          date: 1600980882,
          weight: 3
        },
        {
          date: 1601073883,
          weight: 2
        },
        {
          date: 1601183882,
          weight: 5
        },
        {
          date: 1601183883,
          weight: 5.01
        },
        {
          date: 1601263883,
          weight: 5.01
        }
      ];
      const text = scales.formatLastMeasurings(weightData, 'kg');
      text.should.equal(
        'Your progress in 7 measures:\n\n' +
        '23 of September  --  1kg\n' +
        '23 of September  --  2kg  ' + arrowUp + '\n' +
        '24 of September  --  3kg  ' + arrowUp + '\n' +
        '25 of September  --  2kg  ' + arrowDown + '\n' +
        '26 of September  --  5kg  ' + arrowUp + '\n' +
        '26 of September  --  5.01kg  ' + arrowUp + '\n' +
        '27 of September  --  5kg  ' + '-'
      );
    });
  })
});
