import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Power } from '../../../core/models/power.model';
import { map } from 'rxjs/operators';
import { isAddPowerDialogShowing } from '../../../state/powers/powers.selectors';
import { Subscription } from 'rxjs';
import { POWERS_NAMESPACE, powersReducer, PowersRootState } from '../../../state/powers/powers.reducer';
import { PowersActionPayload } from '../../../state/powers/powers.action';
import { addCommonReducers, CommonStoreWith } from '../../../state/util';
import { Store } from '../../../redux/Store';
import { MatDialog } from '@angular/material';
import { AddPowerDialogComponent } from '../add-power-dialog/add-power-dialog.component';

@Component({
  selector: 'app-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowersComponent implements OnInit, OnDestroy {
  @Output() delete = new EventEmitter<Power>();

  @Input() powers!: Power[];

  private readonly subscriptions: Subscription[] = [];
  private readonly store: CommonStoreWith<PowersRootState, PowersActionPayload>;

  constructor(store: Store, private matDialog: MatDialog) {
    this.store = addCommonReducers(store).addReducer(POWERS_NAMESPACE, powersReducer);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.state$.pipe(
        map(isAddPowerDialogShowing)
      ).subscribe(showing => showing
        ? this.matDialog.open(AddPowerDialogComponent)
        : this.matDialog.closeAll()
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
