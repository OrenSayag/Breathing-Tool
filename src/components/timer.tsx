import { ComponentPropsWithoutRef, FC } from "react";
import { useTimer } from "../hooks/use-timer";

interface Props extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    data: Parameters<typeof useTimer>[0]
}

export const Timer: FC<Props> = ({ className, data,...props }) => {
    const { state, start, pause, stop, setAmountOfSeconds, msToEnd } = useTimer({
        ...data
    });

    const handleSetTime = () => {
        const seconds = prompt("Enter timer duration in seconds:", "60");
        if (seconds) {
            setAmountOfSeconds(parseInt(seconds, 10));
        }
    };

    return (
        <div className={['timer-container', className].filter(Boolean).join(' ')} {...props}>
            <h1>Timer: {formatTime(msToEnd)}</h1>
            <p>State: {state}</p>
            <div className="controls flex flex-col gap-2 text-sm">
                <button className={'border rounded-md px-3 py-1'} onClick={start} disabled={state === 'running'}>
                    Start
                </button>
                <button className={'border rounded-md px-3 py-1'} onClick={pause} disabled={state !== 'running'}>
                    Pause
                </button>
                <button className={'border rounded-md px-3 py-1'} onClick={stop}>Stop</button>
                <button className={'border rounded-md px-3 py-1'} onClick={handleSetTime}>Set Timer</button>
            </div>
        </div>
    );
};


function formatTime(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};
