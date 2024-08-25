import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
export interface section{
  id:string;
  sec:string;
}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})

export class AttendanceComponent implements OnInit {

  UserID: number = 0;
  organisationId: number = 0;
  attendanceFormGroup!: FormGroup;
  attendanceArray: any[] = [];
  allPresentAttendanceArray: any[] = [];
  courseArray:any[]=[];
  hiddenInput:boolean=false;
  isShown:boolean=false;
  PresentFiltered:any[]=[];
  AbsentFiltered:any[]=[];
  attendanceDetailsObj:object={};
  subjectArray:any[]=[];
  constructor(private courseService: CourseService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }

    //this.getDuratioinTypes();
    this.getAllPresedntAttendanceList(this.organisationId);
    this.getSubjectList(this.organisationId);
    this.getCourseList(this.organisationId);
   }
   public section :section[] = [
    {id: 'A', sec: 'A'},
    {id: 'B', sec: 'B'},
    {id: 'C', sec: 'C'},
    {id: 'D', sec: 'D'},
    {id: 'E', sec: 'E'},
    {id: 'F', sec: 'F'},
];
  ngOnInit(): void {
    this.attendanceFormGroup = new FormGroup({
    courseId: new FormControl(null),
    section: new FormControl(null),
    })
  }

  selectedIndex=0;
  onTabChanged(event:any){
    console.log(event)
  }
  onClickAdd(){
    this.selectedIndex = 1;
  }
  getAttendance($orgID:any,$courseId:any,$sec:any) {
    this.attendanceArray=[];
    this.courseService.fetchAllAttendance($orgID,$courseId,$sec).subscribe(response => {
      this.attendanceArray = response.data;
    })
  }
  getAttendanceByCourse($orgID:any,$courseId:any) {
    this.attendanceArray=[];
    this.courseService.fetchAllAttendanceByCourse($orgID,$courseId).subscribe(response => {
      this.attendanceArray = response.data;
    })
  }
  getCourseList($orgID: any) {
    this.courseService.fetchAllCourses($orgID).subscribe(response => {
      this.courseArray = response.data;
      const attendanceDetails=JSON.stringify(this.attendanceArray);
      this.attendanceDetailsObj={attendanceDetails};
      console.log("attendanceDetailsObj:", this.attendanceDetailsObj);
    })
  }
  clearSubject(){
    this.attendanceFormGroup = new FormGroup({
      courseId: new FormControl(null,[Validators.required]),
      section: new FormControl(null),
      })
  }
  getSubjectList($orgID: any) {
    this.courseService.fetchAllSubject($orgID).subscribe(response => {
      this.subjectArray = response.data;
      console.log("subjectArrayProblem:", this.subjectArray);
    })
  }
  getAllPresedntAttendanceList($orgID: any) {
    this.allPresentAttendanceArray=[];
    this.courseService.fetchAllPresentAttendance($orgID).subscribe(response => {
      this.allPresentAttendanceArray = response.data;
      console.log("allPresentAttendanceArray:", this.allPresentAttendanceArray);
    })
  }
  goAttandance(){
    this.selectedIndex = 2;
    let courseId=this.attendanceFormGroup.value.courseId;
    let section=this.attendanceFormGroup.value.section;
    console.log("courseId",courseId);
    console.log("section",section);
    if(section){
      this.getAttendance(this.organisationId,courseId,section);
    }
    else{
      this.getAttendanceByCourse(this.organisationId,courseId);
    }
  }
  onSave(){
    this.attendanceDetailsObj={
      attendanceDetails:this.attendanceArray
    };
    console.log("attendanceDetailsObj:", this.attendanceDetailsObj);
   
 Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.saveAttendance(this.attendanceDetailsObj).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Attendance has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            this.clearSubject();
            this.getAllPresedntAttendanceList(this.organisationId);
            this.selectedIndex = 0;
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
            footer: '<a href>Why do I have this issue?</a>',
            timer: 0
          });
        });

        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    }) 
    
  }
  updateSubject(){

  }
  historyPresent(data:any){
    console.log("attancdance:",data);
  }
  editAbsent(data:any){
    this.PresentFiltered=[];
    this.AbsentFiltered=[];
    console.log("attancdance:",data);
    console.log("ledgerId:",data.ledgerId);
    //const tempCourse = data.course_id;
    let index = this.attendanceArray.findIndex((x: { ledgerId: any; }) => x.ledgerId === data.ledgerId);
    console.log("index:",index);
 if((data.present)===0){
      this.attendanceArray[index].present=1;
    } else{
      this.attendanceArray[index].present=0;
    }
   
    this.PresentFiltered = this.attendanceArray.filter(x => x.present === 1);
    this.AbsentFiltered = this.attendanceArray.filter(x => x.present === 0); 

  }
  editSubject(data:any){

  }
  deleteSubject(data:any){

  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }

}
