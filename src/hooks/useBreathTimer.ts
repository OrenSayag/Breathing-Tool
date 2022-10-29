import { useEffect, useState } from 'react';
import audioCues from '../data/audioCues';
import BreathingExercise from '../types/BreathingExecrise';
import BreathTimerState from '../types/BreathTimerState';

interface Params {
	breathTimerState: BreathTimerState;
	setBreathTimerState: (breathTimerState: BreathTimerState) => void;
	exercise: BreathingExercise;
	volume: number;
}

export default (params: Params) => {
	const { breathTimerState, exercise, setBreathTimerState, volume } = params;
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

	const { isActive, stage, timeToZero } = breathTimerState;
	const nextStage: number = stage === 4 ? 1 : stage + 1;
	const audioCue = audioCues[nextStage - 1];
	audioCue.volume = volume;
	useEffect(() => {
		if (!isActive) {
			clearTimeout(intervalId);
			return;
		}
		const id = setTimeout(() => {
			setBreathTimerState({ ...breathTimerState, timeToZero: timeToZero - 10 });
		}, 10);
		setIntervalId(id);
		if (timeToZero <= 0) {
			audioCue?.play();
			setBreathTimerState({
				...breathTimerState,
				stage: nextStage as 1 | 2 | 3 | 4,
				timeToZero: exercise[nextStage as 1 | 2 | 3 | 4] * 1_000,
			});
		}
	}, [timeToZero, isActive]);
};
