import { useState, useEffect } from 'react'
import { 
  useVideoConfig,
  useCurrentFrame,
  delayRender,
  continueRender,
  Sequence,
  Audio,
} from 'remotion';
import axios from 'axios';
import moment from 'moment-timezone';
import { createApi } from 'unsplash-js';
import narration from './narration.mp3';

const defaultZipCode = '90210';
const zipCode = process.env.ZIP_CODE ?? defaultZipCode;
const baseUrl = process.env.WEATHER_API_BASE_URL;
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

async function getWeatherData(zipCode) {
  const httpClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const weatherData = await httpClient.get(`/api/v1/weather/full/${zipCode}`);
  const sky = weatherData.data.data.current.sky;

  const photos = await unsplash.search.getPhotos({
    query: sky,
    orientation: 'landscape',
  });

  weatherData.data.photos = photos.response.results;

  return weatherData.data;
}

function getGreeting(weatherData) {
  if (!weatherData.data) {
    return 'Hello!';
  }

  const city = weatherData.data.city;
  const now = moment().tz(weatherData.data.tz_long);
  const hour = now.hours();

  if (hour < 12) {
    return `Good morning ${city}!`;
  } else if (hour < 18) {
    return `Good afternoon ${city}!`;
  } else {
    return `Good evening ${city}!`;
  }
}

function getToday(weatherData) {
  if (!weatherData.data) {
    return 'Today!';
  }

  const now = moment().tz(weatherData.data.tz_long);
  const today = now.format('dddd, MMMM Do YYYY');

  return today;
}

function getFarewell(weatherData) {
  if (!weatherData.data) {
    return 'Goodbye!';
  }

  const now = moment().tz(weatherData.data.tz_long);
  const hour = now.hours();

  if (hour < 12) {
    return 'Have a nice day!';
  } else if (hour < 18) {
    return 'Have a nice afternoon!';
  } else {
    return 'Have a nice evening!';
  }
}

export const Weather = () => {
  const [handle] = useState(() => delayRender());
  const [weather, setWeather] = useState({});

  useEffect(() => {
    getWeatherData(zipCode).then((weatherData) => {
      setWeather(weatherData);
      continueRender(handle);
    });
  }, [handle]);

  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const imageUrl = weather.photos ? weather.photos[2].urls.regular: '';

  return (
    <>
      <Sequence from={0}>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "7em",
          color: "black",
          backgroundColor: "white",
          fontFamily: "sans-serif",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
        >
        <h1>{getGreeting(weather)}</h1>
        <h2>{weather.data ? weather.data.zip : ''}</h2>
      </div>
      </Sequence>

      <Sequence from={60}>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "8em",
          color: "black",
          backgroundColor: "white",
          fontFamily: "sans-serif",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
        >
        <h1>{getToday(weather)}</h1>
      </div>
      </Sequence>

      <Sequence from={150}>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "6em",
          color: "black",
          backgroundColor: "white",
          fontFamily: "sans-serif",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
        >
        <h1>Current: {weather.data ? weather.data.current.temp_f : ''}ºF</h1>
        <h2>Min: {weather.data ? weather.data.daily[0].low_f : ''}ºF</h2>
        <h2>Max: {weather.data ? weather.data.daily[0].high_f : ''}ºF</h2>
      </div>
      </Sequence>

      <Sequence from={durationInFrames - 2 * fps}>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "8em",
          color: "black",
          backgroundColor: "white",
          fontFamily: "sans-serif",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
        >
        <h1>{getFarewell(weather)}</h1>
      </div>
      </Sequence>

      <Audio src={narration} />
    </>
  );
};
