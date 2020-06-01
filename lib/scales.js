const moment = require('moment');

function validateWeight(value) {
  let weight = value.replace(',', '.');
  weight = +weight;
  return !isNaN(weight) && weight !== 0;
}

function makeWeightData(value) {
  let weight = value.replace(',', '.');
  weight = +weight;
  return {
    date: Math.floor(Date.now() / 1000),
    weight: weight
  };
}

function formatConfirmation(weightData, units) {
  const date = moment.unix(weightData.date).format('DD [of] MMMM');
  return `${date} is ${weightData.weight}${units}`;
}

function formatLastMeasurings(data, units) {
  const arrowUp = String.fromCodePoint(0x2191);
  const arrowDown = String.fromCodePoint(0x2193);
  const numberOfWeights = data.length;
  if (numberOfWeights === 0) {
    return 'You have no weight measurings.';
  } else if (numberOfWeights < 8) {
    let result = `Your progress in ${numberOfWeights} ${numberOfWeights === 1 ? 'measure' : 'measures'}:\n`;
    data.forEach((weightData, i, arr) => {
      result = result + `\n${moment.unix(weightData.date).format('DD [of] MMMM')}  --  ${weightData.weight}${units}`;
      if (i !== 0) {
        const delta = arr[i - 1].weight - arr[i].weight;
        if (delta === 0) {
          result = result + '  -';
        } else if (delta > 0) {
          result = result + `  ${arrowDown}`;
        } else {
          result = result + `  ${arrowUp}`;
        }
      }
    });
    return result;
  } else {
    let result = `Your progress in 7 measures:\n`;
    for(let i = 1; i < numberOfWeights; i++) {
      result = result + `\n${moment.unix(data[i].date).format('DD [of] MMMM')}  --  ${data[i].weight}${units}`;
      const delta = data[i - 1].weight - data[i].weight;
      if (delta === 0) {
        result = result + '  -';
      } else if (delta > 0) {
        result = result + `  ${arrowDown}`;
      } else {
        result = result + `  ${arrowUp}`;
      }
    }
    return result;
  }
}

module.exports = {
  validateWeight: validateWeight,
  makeWeightData: makeWeightData,
  formatConfirmation: formatConfirmation,
  formatLastMeasurings: formatLastMeasurings
}
