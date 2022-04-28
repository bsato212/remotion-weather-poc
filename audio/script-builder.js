const moment = require('moment-timezone');
const _get = require('lodash/get');

class ScriptBuilder {
  constructor({ weather }) {
    this.weather = weather;
    this.timezone = _get(this.weather, 'data.tz_long', null);
    this.city = _get(this.weather, 'data.city', null);
    this.temperature = _get(this.weather, 'data.current.temp_f', null);
    this.sky = _get(this.weather, 'data.current.sky', null);
    this.rain = _get(this.weather, 'data.current.when_will_it_rain', null);
    this.min = _get(this.weather, 'data.daily.0.low_f', null);
    this.max = _get(this.weather, 'data.daily.0.high_f', null);
    this.degrees = 'degrees Fahrenheit';
  }

  buildIntro() {
    const now = moment().tz(this.timezone);
    const hour = now.hours();

    if (hour < 12) {
      return `Good morning ${this.city}!`;
    } else if (hour < 18) {
      return `Good afternoon ${this.city}!`;
    } else {
      return `Good evening ${this.city}!`;
    }
  }

  buildMain() {
    const now = moment().tz(this.timezone);
    const today = now.format('dddd, MMMM Do YYYY');
    const forecast = _get(this.weather, 'data.forecast', null);

    const mainParts = [
      `Today is ${today}.`,
      `Current temperature is ${this.temperature} ${this.degrees}.`,
      `It will be ${this.sky} today. ${this.rain}`,
      `Expected minimum temperature is ${this.min} ${this.degrees},`,
      `and maximum temperature is ${this.max} ${this.degrees}.`,
    ];

    return mainParts.join(' ');
  }

  buildOutro() {
    const now = moment().tz(this.timezone);
    const hour = now.hours();

    if (hour < 12) {
      return 'Have a nice day!';
    } else if (hour < 18) {
      return 'Have a nice afternoon!';
    } else {
      return 'Have a nice evening!';
    }
  }

  buildScript() {
    const scriptParts = [this.buildIntro(), this.buildMain(), this.buildOutro()];
    const joinChar = ' ';
    return scriptParts.join(joinChar);
  }
}

module.exports = ScriptBuilder;
