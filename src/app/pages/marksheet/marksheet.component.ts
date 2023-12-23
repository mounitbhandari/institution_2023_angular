import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-marksheet',
  templateUrl: './marksheet.component.html',
  styleUrls: ['./marksheet.component.scss']
})
export class MarksheetComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  studentsArray:any[]=[];
  subjectsArray:any[]=[];
  constructor(public commonService: CommonService,
    private reportService: ReportService) { 
      const user = localStorage.getItem('user');
      if (user) {
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:", (this.UserID));
        console.log("user organisationId:", (this.organisationId));
      }
      this.getStudentList(this.organisationId);
      this.getSubjectList(33);
    }

  ngOnInit(): void {
  }

  getStudentList($orgID: any) {
    this.reportService.fetchStudentMarksList($orgID).subscribe(response => {
      this.studentsArray = response.data;
      console.log("studentsArray:", this.studentsArray);
    })
  }
  getSubjectList($couseID: any) {
    this.reportService.fetchSubjectListByCourseId($couseID).subscribe(response => {
      this.subjectsArray = response.data;
      console.log("subjectsArray:", this.subjectsArray);
    })
  }
}
