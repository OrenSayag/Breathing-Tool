interface Params {
	isActive: boolean;
	onClick: () => void;
}

export default function PlayPauseBtn(params: Params) {
	const { isActive, onClick } = params;
	const label = isActive ? 'Pause' : 'Play';
	return (
		<button onClick={() => onClick()} aria-label="PlayPauseBtn">
			{label}
		</button>
	);
}
