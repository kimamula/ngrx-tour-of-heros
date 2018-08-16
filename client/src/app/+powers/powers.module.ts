import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { EditPowerComponent } from './components/edit-power/edit-power.component';
import { PowerDetailComponent } from './components/power-detail/power-detail.component';

import { PowersComponent } from './components/powers/powers.component';
import { EditComponent } from './containers/edit/edit.component';

import { IndexComponent } from './containers/index/index.component';
import { PowerComponent } from './containers/power/power.component';

import { PowersRoutingModule } from './powers-routing.module';
import { AddPowerDialogComponent } from './components/add-power-dialog/add-power-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    PowersRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [AddPowerDialogComponent],
  declarations: [
    AddPowerDialogComponent,
    IndexComponent,
    PowersComponent,
    EditComponent,
    EditPowerComponent,
    PowerDetailComponent,
    PowerComponent
  ]
})
export class PowersModule {}
