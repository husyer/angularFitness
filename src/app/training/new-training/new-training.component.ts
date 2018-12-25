import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription, Observable, pipe } from 'rxjs';
import { UIService } from 'src/app/auth/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Observable<Exercise[]>;
  exercisesSubscription: Subscription;
  private _loadingSubscription: Subscription[] = [];
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private _uiService: UIService
  ) {}

  ngOnInit() {
    this._loadingSubscription.push(
      this._uiService.loadingStateChanged.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );
    this._loadingSubscription.push(
      this.trainingService.getAvailableExercises().subscribe((exs: any) => {
        this.exercises = exs;
      })
    );
  }

  ngOnDestroy() {
    this._loadingSubscription.forEach(elm => {
      elm.unsubscribe();
    });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
