import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Power } from '../../../core/models/power.model';
import { Store } from '../../../redux/Store';
import { POWERS_NAMESPACE, powersReducer, PowersRootState } from '../../../state/powers/powers.reducer';
import {
  ADD_POWER_DIALOG_OPEN, DELETE_POWER,
  LOAD_POWERS,
  PowersActionPayload
} from '../../../state/powers/powers.action';
import { map, retry } from 'rxjs/operators';
import { getAllPowers } from '../../../state/powers/powers.selectors';
import { PowersService } from '../../../core/services/powers.service';
import { SNACKBAR_OPEN } from '../../../state/snackbar/snackbar.action';
import { addCommonReducers, CommonStoreWith } from '../../../state/util';
import { SPINNER_HIDE, SPINNER_SHOW } from '../../../state/spinner/spinner.action';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  powers$: Observable<Array<Power>>;
  private readonly store: CommonStoreWith<PowersRootState, PowersActionPayload>;

  constructor(store: Store, private powersService: PowersService) {
    this.store = addCommonReducers(store).addReducer(POWERS_NAMESPACE, powersReducer);
    this.powers$ = this.store.state$.pipe(map(getAllPowers));
  }

  ngOnInit() {
    this.store.dispatch(SPINNER_SHOW);
    this.powersService.getPowers().pipe(retry(3)).subscribe(
      powers => this.store.dispatch(LOAD_POWERS, powers),
      e => this.store.dispatch(SNACKBAR_OPEN, e),
      () => this.store.dispatch(SPINNER_HIDE)
    );
  }

  add() {
    this.store.dispatch(ADD_POWER_DIALOG_OPEN);
  }

  delete(power: Power) {
    this.store.dispatch(SPINNER_SHOW);
    this.powersService.deletePower(power).pipe(retry(3)).subscribe(
      _power => this.store.dispatch(DELETE_POWER, _power),
      e => this.store.dispatch(SNACKBAR_OPEN, e),
      () => this.store.dispatch(SPINNER_HIDE)
    );
  }
}
