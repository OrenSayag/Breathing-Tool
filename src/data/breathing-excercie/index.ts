import BreathingExercise from '../../types/BreathingExecrise';

const breathingExercises: BreathingExercise[] = [
    {
        '1': 5,
        '2': 2,
        '3': 5,
        '4': 2,
        'name': 'Default',
    }, {
        '1': 8,
        '2': 4,
        '3': 8,
        '4': 4,
        'name': 'Long',
    },
];
export default breathingExercises;

export type Exercise  = typeof breathingExercises[number];
