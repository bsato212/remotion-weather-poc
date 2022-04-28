const trim = require('lodash/trim');
const axios = require('axios').default;

class WeatherApi {
  constructor({ baseUrl }) {
    this.baseUrl = trim(baseUrl, '/');

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async getWeather(zipCode) {
    const response = await this.httpClient.get(`/api/v1/weather/full/${zipCode}`);
    return response.data;
  }
}

module.exports = WeatherApi;
