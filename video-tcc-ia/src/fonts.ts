import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import {continueRender, delayRender} from 'remotion';

// Garante que nenhum frame seja capturado com fonte de fallback.
const handle = delayRender('Carregando fontes Inter e Poppins');
const SAMPLE = 'TCC sem Pânico — ÁÉÍÓÚçãõ';

Promise.all(
	['400 32px Inter', '500 32px Inter', '600 32px Inter', '700 32px Inter', '600 32px Poppins', '700 32px Poppins', '800 32px Poppins'].map(
		(f) => document.fonts.load(f, SAMPLE),
	),
)
	.then(() => document.fonts.ready)
	.then(() => continueRender(handle))
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});
