import { useState, useEffect } from 'react'
import { delayRender, continueRender, Composition } from 'remotion';
import { getAudioDuration } from '@remotion/media-utils';
import { Weather } from './Weather';
import narration from './narration.mp3';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const Video = () => {
	const [handle] = useState(() => delayRender());
	const [duration, setDuration] = useState(1);

	useEffect(() => {
		getAudioDuration(narration).then((durationInSeconds) => {
			setDuration(Math.round(durationInSeconds * FPS));
			continueRender(handle);
		});
	}, [handle]);

	return (
		<>
			<Composition
				id="RemotionWeatherPOC"
				component={Weather}
				durationInFrames={duration}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
