import {COLORS, FONTS, alpha} from '../theme';
import {Reveal} from './Reveal';

type SceneHeaderProps = {
	index: string;
	title: React.ReactNode;
	subtitle?: string;
	color: string;
	delay?: number;
};

export const SceneHeader: React.FC<SceneHeaderProps> = ({index, title, subtitle, color, delay = 0}) => (
	<div style={{position: 'absolute', left: 120, top: 140, right: 120}}>
		<Reveal delay={delay} from="left" distance={50}>
			<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
				<div
					style={{
						fontFamily: FONTS.heading,
						fontWeight: 700,
						fontSize: 26,
						color,
						background: alpha(color, 0.14),
						border: `1.5px solid ${alpha(color, 0.45)}`,
						borderRadius: 14,
						padding: '8px 18px',
						letterSpacing: 1,
					}}
				>
					{index}
				</div>
				<div
					style={{
						fontFamily: FONTS.heading,
						fontWeight: 700,
						fontSize: 60,
						color: COLORS.text,
						letterSpacing: -1,
						lineHeight: 1.1,
					}}
				>
					{title}
				</div>
			</div>
		</Reveal>
		{subtitle ? (
			<Reveal delay={delay + 8} from="left" distance={40}>
				<div
					style={{
						fontFamily: FONTS.body,
						fontSize: 28,
						color: COLORS.muted,
						marginTop: 14,
						marginLeft: 4,
					}}
				>
					{subtitle}
				</div>
			</Reveal>
		) : null}
	</div>
);
