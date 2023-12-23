import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarksheetRoutingModule } from './marksheet-routing.module';
import { MarksheetComponent } from './marksheet.component';


@NgModule({
  declarations: [
    MarksheetComponent
  ],
  imports: [
    CommonModule,
    MarksheetRoutingModule
  ]
})
export class MarksheetModule { }
