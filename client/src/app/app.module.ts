/// <reference types="node" />
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatSnackBarModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { IndexComponent } from './containers/index/index.component';
import { ReduxDevtoolsAdapter } from './redux/Devtools';

@NgModule({
  declarations: [AppComponent, IndexComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SharedModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: process.env.NODE_ENV === 'development'
    ? [ReduxDevtoolsAdapter]
    : [],
  bootstrap: [AppComponent]
})
export class AppModule {}
