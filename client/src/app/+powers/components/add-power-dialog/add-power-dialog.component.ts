import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Power } from '../../../core/models/power.model';
import { POWERS_NAMESPACE, powersReducer, PowersRootState } from '../../../state/powers/powers.reducer';
import {
  ADD_POWER,
  ADD_POWER_DIALOG_CLOSE,
  PowersActionPayload
} from '../../../state/powers/powers.action';
import { Store } from '../../../redux/Store';
import { PowersService } from '../../../core/services/powers.service';
import { retry } from 'rxjs/operators';
import { SNACKBAR_OPEN } from '../../../state/snackbar/snackbar.action';
import { baseStore, BaseStoreWith } from '../../../state/util';
import { SPINNER_HIDE, SPINNER_SHOW } from '../../../state/spinner/spinner.action';

@Component({
  templateUrl: './add-power-dialog.component.html',
  styleUrls: ['./add-power-dialog.component.scss']
})
export class AddPowerDialogComponent {

  form: FormGroup;
  private readonly store: BaseStoreWith<PowersRootState, PowersActionPayload>;

  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddPowerDialogComponent>,
    private powersService: PowersService,
    store: Store
  ) {
    this.store = baseStore(store).extend(POWERS_NAMESPACE, powersReducer);
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  close() {
    this.store.dispatch(ADD_POWER_DIALOG_CLOSE);
  }

  @HostListener('keydown.esc')
  onEsc() {
    this.close();
  }

  save() {
    const power = <Power>this.form.value;
    this.store.dispatch(SPINNER_SHOW);
    this.powersService.createPower(power).pipe(retry(3)).subscribe(
      _power => {
        this.store.dispatch(ADD_POWER, _power);
        this.store.dispatch(SNACKBAR_OPEN, {
          message: 'Power Created',
          action: 'Success'
        });
        this.store.dispatch(ADD_POWER_DIALOG_CLOSE);
      },
      e => this.store.dispatch(SNACKBAR_OPEN, e),
      () => this.store.dispatch(SPINNER_HIDE)
    );
  }
}
