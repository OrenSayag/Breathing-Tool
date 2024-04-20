import { FC } from "react";
import { Cues } from "../../hooks/useBreathTimer";
import classNames from "../../services/utilities/methods/class-names";

interface Props {
  className?: string;
  onSelected: (cue: Cues) => void;
  value: Cues;
}

const CueSelector: FC<Props> = ({ className, onSelected, value }) => {
  return (
    <>
      <div className={classNames("flex flex-col", className)}>
        <label>Sounds</label>
        <select
          className={"text-black"}
          onChange={(e) => onSelected(e.target.value as Cues)}
          value={value}
        >
          {Object.keys(Cues).map((cue) => (
            <option key={cue} value={Cues[cue as keyof typeof Cues]}>
              {Cues[cue as keyof typeof Cues]}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CueSelector;
