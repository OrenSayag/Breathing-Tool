import { useEffect, useMemo, useState } from "react";
import BreathingExercise from "../types/BreathingExecrise";
import BreathTimerState from "../types/BreathTimerState";
import { appPrefix } from "../constants";

export enum Cues {
  DEFAULT = "default",
  TEXT_TO_SPEECH = "tts",
}

interface Params {
  breathTimerState: BreathTimerState;
  setBreathTimerState: (breathTimerState: BreathTimerState) => void;
  exercise: BreathingExercise;
  volume: number;
  cues: Cues;
}

const cueAudios: Record<
  Cues,
  [HTMLAudioElement, HTMLAudioElement, HTMLAudioElement, HTMLAudioElement]
> = {
  [Cues.DEFAULT]: [
    new Audio(appPrefix + "/stage1.mp3"),
    new Audio(appPrefix + "/stage2.mp3"),
    new Audio(appPrefix + "/stage3.mp3"),
    new Audio(appPrefix + "/stage4.mp3"),
  ],
  [Cues.TEXT_TO_SPEECH]: [
    new Audio(appPrefix + "/inhale.mp3"),
    new Audio(appPrefix + "/hold.mp3"),
    new Audio(appPrefix + "/exhale.mp3"),
    new Audio(appPrefix + "/hold.mp3"),
  ],
};

export default (params: Params) => {
  const { breathTimerState, exercise, setBreathTimerState, volume } = params;
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const { isActive, stage, timeToZero } = breathTimerState;
  const nextStage: number = stage === 4 ? 1 : stage + 1;
  const audioCue = useMemo(() => {
    return cueAudios[params.cues][nextStage - 1];
  }, [params.cues, nextStage]);

  useEffect(() => {
    if (audioCue) {
      audioCue.volume = volume;
    }
  }, [audioCue]);

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
      if (audioCue) {
        audioCue.play();
      }
      setBreathTimerState({
        ...breathTimerState,
        stage: nextStage as 1 | 2 | 3 | 4,
        timeToZero: exercise[nextStage as 1 | 2 | 3 | 4] * 1_000,
      });
    }
  }, [timeToZero, isActive]);
};
