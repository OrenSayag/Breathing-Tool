import {FC} from "react";
import classNames from "../../services/utilities/methods/class-names";
import breathingExercises, {Exercise} from "../../data/breathing-excercie";

interface Props {
  className?: string;
  onSelected: (exercise: Exercise) => void;
  value: Exercise;
}

const ExerciseSelector: FC<Props> = ({ className, onSelected, value }) => {
  return (
    <>
      <div className={classNames("flex flex-col", className)}>
        <label>Exercise</label>
        <select
          className={"text-black"}
          onChange={(e) => onSelected(breathingExercises.find(ex=>ex.name === e.target.value)!)}
          value={value.name}
        >
          {breathingExercises.map((ex) => (
            <option key={ex.name} value={ex.name}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ExerciseSelector;
