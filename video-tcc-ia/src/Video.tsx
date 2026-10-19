import {AbsoluteFill, Sequence} from 'remotion';
import {Background} from './components/Background';
import {Hud} from './components/Hud';
import {EthicalGuardrailsScene} from './scenes/EthicalGuardrailsScene';
import {IntroScene} from './scenes/IntroScene';
import {OutroScene} from './scenes/OutroScene';
import {UseCasesScene} from './scenes/UseCasesScene';
import {WorkflowScene} from './scenes/WorkflowScene';
import {SCENES, SceneId} from './theme';

const SCENE_COMPONENTS: Record<SceneId, React.FC<{duration: number}>> = {
	intro: IntroScene,
	useCases: UseCasesScene,
	ethics: EthicalGuardrailsScene,
	workflow: WorkflowScene,
	outro: OutroScene,
};

export const MainComposition: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#0B0F19'}}>
		<Background />
		{SCENES.map((scene) => {
			const Scene = SCENE_COMPONENTS[scene.id];
			return (
				<Sequence key={scene.id} name={scene.label} from={scene.from} durationInFrames={scene.duration}>
					<Scene duration={scene.duration} />
				</Sequence>
			);
		})}
		<Hud />
	</AbsoluteFill>
);
