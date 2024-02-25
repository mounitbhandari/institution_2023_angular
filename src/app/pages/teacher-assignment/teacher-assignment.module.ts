import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherAssignmentRoutingModule } from './teacher-assignment-routing.module';
import { TeacherAssignmentComponent } from './teacher-assignment.component';


@NgModule({
  declarations: [
    TeacherAssignmentComponent
  ],
  imports: [
    CommonModule,
    TeacherAssignmentRoutingModule
  ]
})
export class TeacherAssignmentModule { }
