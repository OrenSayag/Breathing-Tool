import {useState} from "react";
import "./App.css";
import Diaphragm from "./components/Diaphragm";
import PlayPauseBtn from "./components/PlayPauseBtn";
import breathingExercises, {Exercise} from "./data/breathing-excercie";
import useBreathTimer, {Cues} from "./hooks/useBreathTimer";
import BreathingExercise from "./types/BreathingExecrise";
import BreathTimerState from "./types/BreathTimerState";
import CueSelector from "./components/cue-selector";
import ExerciseSelector from "./components/exercise-selector";
import {Timer} from "./components/timer";
import {playTimerEnd} from "./services/utilities/audio/play-timer-end";

function App() {
    const getExercise = () => {
        const name = localStorage.getItem("exercise");
        const found = breathingExercises.find(ex => ex.name === name)
        if (found) {
            return found
        }
        return undefined;
    };
    const [exercise, setExercise] = useState<BreathingExercise>(
        getExercise() ?? breathingExercises[1],
    );
    const getVolume = () => {
        const volume = localStorage.getItem("volume");
        if (!Number.isNaN(Number(volume))) {
            return Number(volume);
        }
        return 1;
    };
    const setLocalstorageVolume = (volume: number) => {
        localStorage.setItem("volume", volume.toString());
    };

    const getCue = () => {
        const cue = localStorage.getItem("cue");
        if (Object.values(Cues).includes(cue as Cues)) {
            return cue as Cues;
        }
        return undefined;
    };

    const setLocalstorageCue = (cue: Cues) => {
        localStorage.setItem("cue", cue);
    };
    const setLocalstorageTimer = (timer_amountOfSeconds: number) => {
        localStorage.setItem("timer_amountOfSeconds", timer_amountOfSeconds.toString());
    };
    const getLocalstorageTimer = (): Number | undefined => {
        const val =  localStorage.getItem("timer_amountOfSeconds");
        if(Number.isNaN(Number(val))) {
            return undefined;
        }
        return Number(val)
    };
    const setLocalstorageExercise = (ex: Exercise) => {
        localStorage.setItem("exercise", ex.name);
    };
    const [volume, setVolume] = useState<number>(getVolume());
    const [cue, setCue] = useState<Cues>(getCue() ?? Cues.DEFAULT);
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
        cues: cue,
    });
    return (
        <div className="min-h-screen min-h-screen bg-primary text-white flex flex-col items-center">
            <div className="flex w-full p-4">
                <PlayPauseBtn
                    onClick={() =>
                        toggleBreathingActive(setBreathTimerState, breathTimerState)
                    }
                    isActive={breathTimerState.isActive}
                />
            </div>
            <div className="flex grow w-full relative justify-center items-center">
                <Diaphragm
                    percentage={
                        (breathTimerState.timeToZero /
                            (exercise[breathTimerState.stage] * 1000)) *
                        100
                    }
                    {...breathTimerState}
                />
                <div className="absolute bottom-2">
                    {breathTimerState.isActive &&
                        determineGuideline(breathTimerState.stage)}
                </div>
                <div className="absolute bottom-2 left-2 w-full flex justify-between items-center pr-6">
                    <input
                        type="range"
                        value={volume * 100}
                        onChange={(e) => {
                            setVolume(+e.target.value / 100);
                            setLocalstorageVolume(+e.target.value / 100);
                        }}
                        min={0}
                        max={100}
                        name=""
                        id=""
                    />
                    <div>

                        <CueSelector
                            onSelected={(c) => {
                                setCue(c);
                                setLocalstorageCue(c);
                            }}
                            value={cue}
                        />
                        <ExerciseSelector
                            onSelected={(ex) => {
                                setExercise(ex);
                                setLocalstorageExercise(ex)
                            }}
                            value={exercise}
                        />
                    </div>
                </div>
            </div>
            <Timer
                className={'absolute top-6 right-6'}
                data={{
                    onEnd() {
                        playTimerEnd()
                    },
                    onSetAmountOfSeconds(aos: number) {
                        setLocalstorageTimer(aos)
                    },
                    amountOfSeconds: getLocalstorageTimer() as number,
                    onPlay() {
                        setBreathTimerState(prev=>({...prev, isActive: true}))
                    },
                    onPause() {
                        setBreathTimerState(prev=>({...prev, isActive: false}))
                    },
                    onStop() {
                        setBreathTimerState({
                            stage: 4,
                            timeToZero: 10,
                            isActive: false,
                        })
                    }
                }}/>
        </div>
    );
}

function determineGuideline(stage: 1 | 2 | 3 | 4) {
    switch (stage) {
        case 1:
            return "Inhale";
        case 2:
        case 4:
            return "Hold";
        case 3:
            return "Exhale";
        default:
            break;
    }
}

function toggleBreathingActive(
    setBreathTimerState: (breathTimerState: BreathTimerState) => void,
    breathTimerState: BreathTimerState,
) {
    setBreathTimerState({
        ...breathTimerState,
        isActive: !breathTimerState.isActive,
    });
}

export default App;
