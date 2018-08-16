import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component';

import { LayoutComponent } from './components/layout/layout.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

const components = [
  DialogHeaderComponent,
  LayoutComponent,
  NotFoundComponent
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class SharedModule {}
