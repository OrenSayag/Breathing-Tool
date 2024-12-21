import {useCallback, useEffect, useRef, useState} from "react";

enum TimerState {
    STOPPED = 'stopped',
    RUNNING = 'running',
    PAUSED = 'paused'
};

const DEFAULT_INITIAL_SECONDS = 60;

type Input = {
    onEnd?(): void;
    amountOfSeconds?: number
    onSetAmountOfSeconds?(aos: number): void
    onPlay?(): void;
    onPause?(): void;
    onStop?(): void;
}

export const useTimer = ({
                             amountOfSeconds: _amountOfSeconds = DEFAULT_INITIAL_SECONDS,
                             onEnd,
                             onSetAmountOfSeconds,
                             onPlay, onPause, onStop
                         }: Input) => {
    const [amountOfSeconds, setAmountOfSeconds] = useState(_amountOfSeconds);
    const [msToEnd, setMsToEnd] = useState(amountOfSeconds * 1_000);
    const [state, setState] = useState<TimerState>(TimerState.STOPPED);
    const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
    const requestRef = useRef<number | null>(null);
    const stateRef = useRef(state); // Track the current state
    const msToEndRef = useRef(msToEnd); // Track the remaining milliseconds

    useEffect(() => {
        setMsToEnd(1_000 * amountOfSeconds)
    }, [amountOfSeconds]);

    const start = () => {
        if (state !== TimerState.RUNNING) {
            setLastTimestamp(performance.now());
            setState(TimerState.RUNNING);
            stateRef.current = TimerState.RUNNING; // Update stateRef
            onPlay?.()
        }
    };

    const pause = useCallback(() => {
        if (stateRef.current === TimerState.RUNNING) {
            setState(TimerState.PAUSED);
            stateRef.current = TimerState.PAUSED; // Update stateRef
            cancelAnimationFrame(requestRef.current!);
            onPause?.()
        }
    }, []);

    const stop = () => {
        setState(TimerState.STOPPED);
        stateRef.current = TimerState.STOPPED; // Update stateRef
        cancelAnimationFrame(requestRef.current!);
        setLastTimestamp(null);
        setAmountOfSeconds(amountOfSeconds);
        setMsToEnd(amountOfSeconds * 1_000);
        onStop?.()
    };

    const tick = useCallback((timestamp: number) => {
        if (stateRef.current === TimerState.RUNNING) {
            const elapsed = timestamp - (lastTimestamp || 0);
            const updatedMsToEnd = msToEndRef.current - elapsed;

            if (updatedMsToEnd > 0) {
                setMsToEnd(updatedMsToEnd);
                msToEndRef.current = updatedMsToEnd; // Update msToEndRef
                setLastTimestamp(timestamp);
                requestRef.current = requestAnimationFrame(tick);
            } else {
                stop()
                onEnd?.()
            }
        }
    }, [lastTimestamp, onEnd]);

    useEffect(() => {
        if (state === TimerState.RUNNING && lastTimestamp !== null) {
            msToEndRef.current = msToEnd; // Sync initial msToEndRef
            requestRef.current = requestAnimationFrame(tick);
        }

        return () => cancelAnimationFrame(requestRef.current!);
    }, [state, lastTimestamp, tick, msToEnd]);

    return {
        start,
        pause,
        stop,
        msToEnd,
        setAmountOfSeconds: (aos: number) => {
            setAmountOfSeconds(aos);
            onSetAmountOfSeconds?.(aos)
        },
        state,
    };
};
