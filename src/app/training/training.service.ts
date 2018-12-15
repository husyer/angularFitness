import { Exercise } from './exercise.model';
import { Subject, Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesSubject = new Subject<Exercise[]>();
  availableExercisesSubject = new Subject<Exercise[]>();

  private runningExercise: Exercise;
  exercises: Exercise[] = [];
  availableExercises: Exercise[] = [];
  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          console.log('docArray', docArray);
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe((exs: Exercise[]) => {
        this.availableExercises = exs;
        this.availableExercisesSubject.next([...this.availableExercises]);
      });
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
