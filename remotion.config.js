import {Config} from 'remotion';

Config.Rendering.setImageFormat('png');
Config.Output.setPixelFormat('yuv420p');
Config.Output.setCodec('h264');
Config.Output.setCrf(16);
