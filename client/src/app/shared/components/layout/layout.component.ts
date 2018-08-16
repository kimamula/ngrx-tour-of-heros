import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { Store } from '../../../redux/Store';
import { SNACKBAR_CLOSE } from '../../../state/snackbar/snackbar.action';
import { isSpinnerShowing } from '../../../state/spinner/spinner.selectors';
import { map } from 'rxjs/operators';
import { snackbarSetting } from '../../../state/snackbar/snackbar.selectors';
import { addCommonReducers, CommonStoreWith } from '../../../state/util';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  private readonly store: CommonStoreWith;
  private subscriptions: Subscription[] = [];

  @ViewChild('sidenav') sidenav?: MatSidenav;

  constructor(store: Store, private matSnackBar: MatSnackBar) {
    this.store = addCommonReducers(store);
    this.loading$ = this.store.state$.pipe(map(isSpinnerShowing));
  }

  ngOnInit() {
    let timer: any;
    this.subscriptions.push(
      this.store.state$.pipe(map(snackbarSetting)).subscribe(setting => {
        if (!setting) {
          return this.matSnackBar.dismiss();
        }
        clearTimeout(timer);
        this.matSnackBar.open(setting.message, setting.action, setting.config);
        timer = setTimeout(() => this.store.dispatch(SNACKBAR_CLOSE), 2000);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
