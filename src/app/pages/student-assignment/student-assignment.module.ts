import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentAssignmentRoutingModule } from './student-assignment-routing.module';
import { StudentAssignmentComponent } from './student-assignment.component';


@NgModule({
  declarations: [
    StudentAssignmentComponent
  ],
  imports: [
    CommonModule,
    StudentAssignmentRoutingModule
  ]
})
export class StudentAssignmentModule { }
