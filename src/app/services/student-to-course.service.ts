import { Injectable } from '@angular/core';
import { StudentToCourse } from '../models/studenttocourse.model';
import { Course } from '../models/course.model';
import { catchError, Subject, tap } from 'rxjs';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentToCourseService {
  studentList: Student[] =[];
  courseList: Course[] =[];
  studentToCourseList: StudentToCourse[] =[];
  durationTypeList: any[] =[];
  studentToCourseSubject = new Subject<StudentToCourse[]>();
  durationTypeSubject = new Subject<Course[]>();
  studentSubject = new Subject<Student[]>();
  //studentSubject: any;
  courseSubject: any;
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) { }
  

  fetchAllDurationType(){
    return this.http.get<any>(this.commonService.getAPI() + '/durationTypes')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.durationTypeList=response.data;
      this.durationTypeSubject.next([...this.durationTypeList]);
    })));
  }
 
  updateStudentToCourse(studentTocoursetData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/studentCourseRegistrations', studentTocoursetData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.durationTypeSubject.next([...this.courseList]);
      }
    }))
  }
  saveStudentToCourse(studentTocoursetData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/studentCourseRegistrations', studentTocoursetData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service',response);
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.durationTypeSubject.next([...this.durationTypeList]);
      }
    }))
  }

  fetchAllCourses(){
    return this.http.get<any>(this.commonService.getAPI() + '/courses')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Course[]}) => {
      this.courseList=response.data;
      /* console.log("courseList:",this.courseList); */
      this.courseSubject.next([...this.courseList]);
    })));
  }
  
  fetchAllStudentToCourses($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/getStudentCourseRegistrations/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList); 
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  getStudentToCourses(){
    return [...this.studentToCourseList];
  }

  deleteStudentToCourse(id:any){
    console.log("service id:",id);
    //return 0;
     return this.http.delete<any>(this.commonService.getAPI() + '/studentCourseRegistrations/'+ id)
    .pipe(catchError(this.errorService.serverError), tap(response => {
     
     
    }))

  }
  fetchFeesModeType(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/FeesModeTypeById',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.studentToCourseList=response.data;
      console.log("Fees Mode Type ID:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchCourseDetails(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/CourseDetailsById',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.studentToCourseList=response.data;
      /* console.log("Course Details:",this.studentToCourseList); */
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchStudentToCourseDetails(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/studentToCourseRegistrationDetails',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.studentToCourseList=response.data;
      /* console.log("Course Details:",this.studentToCourseList); */
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchAllTotalActiveStudent($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/totalActiveStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }
  fetchMonthlyActiveStudent($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/totalMonthlyActiveStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }
  fetchFullCourseActiveStudent($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/totalFullCourseActiveStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any}) => {
      this.courseList=response.data;
      this.durationTypeSubject.next([...this.courseList]);
    })));
  }

}
