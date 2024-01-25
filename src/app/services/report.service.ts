import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Subject } from 'rxjs/internal/Subject';
import { tap } from 'rxjs';
import { StudentToCourse } from '../models/studenttocourse.model';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  incomeReportList:any[]=[];
  newsDataList:any[]=[];
  incomeReportSubject = new Subject<any[]>();
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) {


  }

  fetchStudentMarksList(markdata:any){
    this.newsDataList=[];
    return this.http.post<any>(this.commonService.getAPI() + '/getMarkStudents',markdata)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.newsDataList=response.data;
      })));
  }
  fetchSubjectListByCourseId($courseID:any){
    this.newsDataList=[];
    return this.http.get<any>(this.commonService.getAPI() + '/getSubjectsByCourseId/'+$courseID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.newsDataList=response.data;
      })));
  }
  fetchStudentNewsListReport(newsData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/getStudentNewsList', newsData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service newsDataList:',response);
      if (response.success === 1){
        this.newsDataList.unshift(response.data);
      }
    }))
  }

  updateNewsStatus(newsData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/updateNewsStatus', newsData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at news status update',response);
      if (response.success === 1){
        this.newsDataList.unshift(response.data);
        
      }
    }))
  }
  fetchNewsListReport($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/getNewsList/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.newsDataList=response.data;
      })));
  }

  saveNews(newsData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/saveNews', newsData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      console.log('at service newsDataList:',response);
      if (response.success === 1){
        this.newsDataList.unshift(response.data);
      }
    }))
  }
  fetchAllReceiptIncomeReport($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/getAllIncomeReport/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      this.incomeReportSubject.next([...this.incomeReportList]);
      console.log("all Income:",this.incomeReportList);
    })));
  }
  fetchWorkingDaysReport($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/workingDays/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      this.incomeReportSubject.next([...this.incomeReportList]);
      //console.log("Working Days:",this.incomeReportList);
    })));
  }
  fetchStudentBirthDayDaysReport($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/reportStudentBirthday/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      //this.incomeReportSubject.next([...this.incomeReportList]);
      //console.log("Birthday List:",this.incomeReportList);
    })));
  }
  fetchStudentUpcomingDueListReport($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/reportUpcomingDueList/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      //this.incomeReportSubject.next([...this.incomeReportList]);
      //console.log("Birthday List:",this.incomeReportList);
    })));
  }
  fetchStudentToCourseRegistrationReport($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/reportStudentToCourseRegistrationList/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      this.incomeReportSubject.next([...this.incomeReportList]);
      //console.log("Birthday List:",this.incomeReportList);
    })));
  }
  fetchStudentToCourseRegistrationReportLedgerId($ledgerID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/reportStudentToCourseRegistrationListLedgerId/'+$ledgerID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      this.incomeReportSubject.next([...this.incomeReportList]);
      //console.log("Birthday List:",this.incomeReportList);
    })));
  }
  fetchAllIncomeReport(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/getAllIncomeListReport',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.incomeReportList=response.data;
      this.incomeReportSubject.next([...this.incomeReportList]);
    })));
  }
}
