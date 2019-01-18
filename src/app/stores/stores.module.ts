import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { rootReducers, rootEffects } from '.';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(rootReducers),
    EffectsModule.forRoot(rootEffects),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 15 }),
  ],
  declarations: []
})
export class StoresModule { }
