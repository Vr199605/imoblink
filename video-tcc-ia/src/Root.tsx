import './fonts';
import {Composition} from 'remotion';
import {TOTAL_FRAMES, VIDEO} from './theme';
import {MainComposition} from './Video';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="MainComposition"
		component={MainComposition}
		durationInFrames={TOTAL_FRAMES}
		fps={VIDEO.fps}
		width={VIDEO.width}
		height={VIDEO.height}
	/>
);
