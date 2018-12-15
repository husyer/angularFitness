import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  exerciseChanged = new Subject<Exercise>();
  private runningExercise: Exercise;
  exercises: Exercise[] = [];
  exercisesSubject = new Subject<Exercise[]>();
  constructor() {}

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  getRunninExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    this.exercisesSubject.next(this.exercises.slice());
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    console.log(this.exercises);
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    this.exercisesSubject.next(this.exercises.slice());
  }

  getCompletedOrCancelledExercises() {
    console.log('hello', this.exercises);
    return this.availableExercises.slice();
  }
}
