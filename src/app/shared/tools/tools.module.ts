import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { asyncStoreReducerKey, asyncStoreReducer, AsyncActionService } from './services/async-action/async-action.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(asyncStoreReducerKey, asyncStoreReducer),
  ],
  declarations: [],
  providers: [
    AsyncActionService
  ]
})
export class ToolsModule { }
