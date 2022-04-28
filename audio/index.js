require('dotenv').config();
const process = require('process');
const WeatherApi = require('./weather-api');
const ScriptBuilder = require('./script-builder');
const PollyClient = require('./polly-client');
const fs = require('fs');

const defaultZipCode = '90210';
const zipCode = process.env.ZIP_CODE ?? defaultZipCode;
const defaultRegion = 'us-east-1';

async function main() {
  const weatherApi = new WeatherApi({
    baseUrl: process.env.WEATHER_API_BASE_URL,
  });
  const weather = await weatherApi.getWeather(zipCode);

  const scriptBuilder = new ScriptBuilder({ weather });
  const script = scriptBuilder.buildScript();

  const pollyClient = new PollyClient({ region: defaultRegion });
  const response = await pollyClient.synthesizeSpeech({ text: script });
  fs.writeFileSync('./src/narration.mp3', response.AudioStream);

  console.log(response.ContentType, response.RequestCharacters);
}

main().catch((error) => console.log(error));
