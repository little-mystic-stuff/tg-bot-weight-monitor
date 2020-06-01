const buttons = {
  kilos: {
    text: 'kilograms',
    callback_data: 'kg'
  },
  pounds : {
    text: 'pounds',
    callback_data: 'lb'
  },
  enterWeight: {
    text: 'Enter current weight',
    callback_data: 'new_weight'
  },
  showStats: {
    text: 'Show statistics',
    callback_data: "show_stats"
  },
  mainMenu: {
    text: 'Back to the main menu',
    callback_data: 'main_menu'
  },
  tryAgain: {
    text: 'Try again',
    callback_data: 'new_weight'
  },
  confirmWeight: {
    text: 'Yes',
    callback_data: 'confirm_weight'
  },
  cancelWeight: {
    text: 'No',
    callback_data: 'cancel_weight'
  },
  statLastWeek: {
    text: 'Last week',
    callback_data: 'stat_last_week'
  },
  statLastSevenMeasurings: {
    text: 'Last seven measurings',
    callback_data: 'stat_last_seven_measurings'
  }
};

module.exports = {
  welcomeScreen: {
    text: 'Welcome to the Weight Monitor!\nPlease choose your unit of measure:',
    replyMarkup: {inline_keyboard: [[buttons.kilos],[buttons.pounds]]}
  },
  mainMenu: {
    text: 'Welcome to the Weight Monitor!\nGlad to see you!',
    replyMarkup: {inline_keyboard: [[buttons.enterWeight],[buttons.showStats]]}
  },
  newWeight: {
    text: 'Enter your weight.',
    replyMarkup: {inline_keyboard: [[buttons.mainMenu]]}
  },
  incorrectWeight: {
    text: 'Weight value is incorrect.',
    replyMarkup: {inline_keyboard: [[buttons.tryAgain],[buttons.mainMenu]]}
  },
  weightConfirmation: (weight, units) => {
    return {
      text: `Is your current weight ${weight}${units}?`,
      replyMarkup: {inline_keyboard: [[buttons.confirmWeight],[buttons.cancelWeight]]}
    }
  },
  weightResult: (formattedWeightData) => {
    return {
      text: `Your current weight at ${formattedWeightData}`,
      replyMarkup: {inline_keyboard: [[buttons.mainMenu]]}
    }
  },
  statsMainMenu: {
    text: 'What data do you need?',
    replyMarkup: {inline_keyboard: [[buttons.statLastSevenMeasurings],[buttons.mainMenu]]}
  },
  statsLastSevenMeasurings: (text) => {
    return {
      text: text,
      replyMarkup: {inline_keyboard: [[buttons.mainMenu]]}
    }
  },
  helpPage: {
    text: 'Unknoun command.\nPlease follow instructions.',
    replyMarkup: {inline_keyboard: [[buttons.mainMenu]]}
  }
}
