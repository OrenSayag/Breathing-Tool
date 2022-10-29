interface Params {
	stage: 1 | 2 | 3 | 4;
	percentage: number;
}

export default function Diaphragm(params: Params) {
	const { stage, percentage } = params;
	return (
		<div
			role="display"
			aria-label="Diaphragm"
			style={{
				scale: calcScale(stage, percentage),
			}}
			className={`rounded-full bg-secondary w-64 h-64`}
		/>
	);
}

function calcScale(stage: number, percentage: number) {
	const minPercentage = 20;
	switch (stage) {
		case 1:
			return 100 - percentage + minPercentage + '%';
			break;

		case 2:
			return 100 + minPercentage + '%';
			break;

		case 3:
			return percentage + minPercentage + '%';

		case 4:
			return minPercentage + '%';

		default:
			break;
	}
}
