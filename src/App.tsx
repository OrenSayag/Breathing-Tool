import { useState } from 'react';
import './App.css';
import Diaphragm from './components/Diaphragm';
import PlayPauseBtn from './components/PlayPauseBtn';
import breathingExercises from './data/breathing-excercie';
import useBreathTimer from './hooks/useBreathTimer';
import BreathingExercise from './types/BreathingExecrise';
import BreathTimerState from './types/BreathTimerState';

function App() {
	const [exercise, setExercise] = useState<BreathingExercise>(breathingExercises[0]);
	const [volume, setVolume] = useState<number>(1);
	const [breathTimerState, setBreathTimerState] = useState<BreathTimerState>({
		stage: 4,
		timeToZero: 10,
		isActive: false,
	});
	useBreathTimer({
		exercise,
		breathTimerState,
		setBreathTimerState,
		volume,
	});
	return (
		<div className="min-h-screen min-h-screen bg-primary text-white flex flex-col items-center">
			<div className="flex w-full p-4">
				<PlayPauseBtn
					onClick={() => toggleBreathingActive(setBreathTimerState, breathTimerState)}
					isActive={breathTimerState.isActive}
				/>
			</div>
			<div className="flex grow w-full relative justify-center items-center">
				<Diaphragm
					percentage={
						(breathTimerState.timeToZero / (exercise[breathTimerState.stage] * 1000)) *
						100
					}
					{...breathTimerState}
				/>
				<div className="absolute bottom-2">
					{breathTimerState.isActive && determineGuideline(breathTimerState.stage)}
				</div>
				<div className="absolute bottom-2 left-2">
					<input
						type="range"
						onChange={(e) => setVolume(+e.target.value / 100)}
						min={0}
						max={100}
						name=""
						id=""
					/>
				</div>
			</div>
		</div>
	);
}

function determineGuideline(stage: 1 | 2 | 3 | 4) {
	switch (stage) {
		case 1:
			return 'Inhale';
		case 2:
		case 4:
			return 'Hold';
		case 3:
			return 'Exhale';
		default:
			break;
	}
}

function toggleBreathingActive(
	setBreathTimerState: (breathTimerState: BreathTimerState) => void,
	breathTimerState: BreathTimerState
) {
	setBreathTimerState({
		...breathTimerState,
		isActive: !breathTimerState.isActive,
	});
}

export default App;
