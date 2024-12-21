import {appPrefix} from "../../../constants";

const timerEndAudio = new Audio(appPrefix + "/timer-end-001.mp3")

export const playTimerEnd = () => {
    timerEndAudio.play()
}
