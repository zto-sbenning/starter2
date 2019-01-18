import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routing/routing.module';
import { MaterialModule } from './material/material.module';
import { ToolsModule } from './tools/tools.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoutingModule,
    MaterialModule,
    ToolsModule
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoutingModule,
    MaterialModule,
    ToolsModule
  ]
})
export class SharedModule { }
