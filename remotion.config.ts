import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(96);
Config.setConcurrency(2);
Config.setChromiumOpenGlRenderer('swangle');
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE ?? null);
