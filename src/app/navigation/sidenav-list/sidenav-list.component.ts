import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSideNav = new EventEmitter<void>();

  authSubscription: Subscription;
  isAuth = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(auth => {
      this.isAuth = auth;
    });
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  onClose() {
    this.closeSideNav.emit();
  }
}
