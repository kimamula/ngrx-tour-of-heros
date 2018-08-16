import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, first, map, retry, switchMap, tap } from 'rxjs/operators';

import { Power } from '../../../core/models/power.model';
import { Store } from '../../../redux/Store';
import {
  LOAD_POWER,
  PowersActionPayload,
  SELECT_POWER,
  UPDATE_POWER
} from '../../../state/powers/powers.action';
import { POWERS_NAMESPACE, powersReducer, PowersRootState } from '../../../state/powers/powers.reducer';
import { getPowerEntities, getSelectedPower } from '../../../state/powers/powers.selectors';
import { PowersService } from '../../../core/services/powers.service';
import { SNACKBAR_OPEN } from '../../../state/snackbar/snackbar.action';
import { SPINNER_HIDE, SPINNER_SHOW } from '../../../state/spinner/spinner.action';
import { baseStore, BaseStoreWith } from '../../../state/util';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  power: Observable<Power | undefined>;
  private readonly store: BaseStoreWith<PowersRootState, PowersActionPayload>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private powersService: PowersService,
    store: Store
  ) {
    this.store = baseStore(store).extend(POWERS_NAMESPACE, powersReducer);
    this.power = this.activatedRoute.paramMap.pipe(
      tap(paramMap => {
        const id = +paramMap.get('id')!;
        this.store.dispatch(SELECT_POWER, { id });
        this.hasPowerInStore(id).pipe(
          filter(exists => !exists),
          tap(() => this.store.dispatch(SPINNER_SHOW)),
          switchMap(() => this.powersService.getPower(id).pipe(retry(3)))
        ).subscribe(
          power => this.store.dispatch(LOAD_POWER, power),
          e => this.store.dispatch(SNACKBAR_OPEN, e),
      () => this.store.dispatch(SPINNER_HIDE)
        );
      }),
      switchMap(() => this.store.state$.pipe(map(getSelectedPower)))
    );
  }

  hasPowerInStore(id: number): Observable<boolean> {
    return this.store.state$
      .pipe(
        map(getPowerEntities),
        first(powers => powers !== null),
        map(powers => powers[id] !== undefined)
      );
  }

  powerChange(power: Power) {
    this.store.dispatch(SPINNER_SHOW);
    this.powersService.updatePower(power).pipe(retry(3)).subscribe(
      _power => this.store.dispatch(UPDATE_POWER, _power),
      e => this.store.dispatch(SNACKBAR_OPEN, e),
      () => this.store.dispatch(SPINNER_HIDE)
    );
  }
}
