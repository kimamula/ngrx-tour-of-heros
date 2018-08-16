import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { isSpinnerShowing } from '../../../state/shared/reducers';
import { AppState } from '../../../state/app.interfaces';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  loading: Observable<boolean>;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.loading = this.store.pipe(select(isSpinnerShowing));
  }
}
