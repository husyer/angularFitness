import { Exercise } from './exercise.model';
import { Subject, Observable, pipe, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UIService } from '../auth/shared/ui.service';
@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  allExercisesSubject = new Subject<Exercise[]>();
  _availableExercisesSubject: Subject<Exercise[]>;

  private _runningExercise: Exercise;
  private _allExercises: Exercise[] = [];
  private _availableExercises: Exercise[] = [];
  private _subscription: Subscription[] = [];

  constructor(private db: AngularFirestore, private _uiService: UIService) {}

  getAvailableExercises(): Observable<Exercise[]> {
    if (this._availableExercisesSubject) {
      return this._availableExercisesSubject.asObservable();
    } else {
      this._availableExercisesSubject = new Subject<Exercise[]>();
      this.fetchAvailableExercises();
      return this._availableExercisesSubject.asObservable();
    }

  }

  fetchAvailableExercises() {
    this._uiService.loadingStateChanged.next(true);
    this._subscription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe((exs: Exercise[]) => {
        this._availableExercises = exs;
        this._availableExercisesSubject.next([...this._availableExercises]);
        this._uiService.loadingStateChanged.next(false);
      }));
  }

  startExercise(selectedId: string) {
    this.db
      .doc('availableExercises/' + selectedId)
      .update({ lastSelected: new Date() });

    this._runningExercise = this._availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this._runningExercise });
  }

  getRunninExercise() {
    return { ...this._runningExercise };
  }

  completeExercise() {
    this.addToDataBase({
      ...this._runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this._runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addToDataBase({
      ...this._runningExercise,
      duration: this._runningExercise.duration * (progress / 100),
      calories: this._runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });

    this._runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getCompletedOrCancelledExercises() {
    this._subscription.push(this.db
      .collection('finishedExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe((exs: Exercise[]) => {
        this._allExercises = exs;
        this.allExercisesSubject.next([...this._allExercises]);
      }));
  }

  private addToDataBase(exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSuscription() {
    console.log(this._subscription);
    this._subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
