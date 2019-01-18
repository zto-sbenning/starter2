import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { StoresModule } from './stores/stores.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    StoresModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
