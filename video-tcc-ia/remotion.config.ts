import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// Permite usar um Chromium já instalado na máquina (ex.: ambientes sem acesso
// para baixar o Chrome Headless Shell): REMOTION_BROWSER=/caminho/do/chrome
if (process.env.REMOTION_BROWSER) {
	Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
