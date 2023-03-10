import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Subject } from 'rxjs/internal/Subject';
import { tap } from 'rxjs';
import { StudentToCourse } from '../models/studenttocourse.model';
import { CommonService } from './common.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionServicesService {
  studentToCourseList: StudentToCourse[] =[];
  feesNameList:any[]=[];
  organizationList:any[]=[];
  studentNameList:any[]=[];
  feesReceivedList:any[]=[];
  feesReceivedDetailsList:any[]=[];
  transactionList:any[]=[];
  //feesReceivedList:any[]=[];
  studentToCourseSubject = new Subject<StudentToCourse[]>();
  feesNameSubject = new Subject<any[]>();
  studentNameSubject = new Subject<any[]>();
  feesReceivedSubject = new Subject<any[]>();
  transactionListSubject = new Subject<any[]>();
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) {


  }

  fetchOrganizationDetails($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getOrganization/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.organizationList=response.data;
      //this.feesNameSubject.next([...this.feesNameList]);
    })));
  }

  fetchFeeReceivedDetailsList(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeesReceived',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedDetailsList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedDetailsList]);
    })));
  }
  fetchAllReceipt(data: any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getAllReceiptId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchSingleReceipt(data: any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getReceiptId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllStudentToCourses(data: any){
    return this.http.post<any>(this.commonService.getAPI() + '/getRegisterCourseByStudentId', data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  fetchAllFeesName(){
    return this.http.get<any>(this.commonService.getAPI() + '/feesName')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesNameList=response.data;
      this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchDiscountFeesName(){
    return this.http.get<any>(this.commonService.getAPI() + '/students/feesNameDiscount')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      // this.feesNameList=response.data;
      // this.feesNameSubject.next([...this.feesNameList]);
    })));
  }
  fetchAllStudentName($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/registerStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      // this.studentNameList=response.data;
      // this.studentNameSubject.next([...this.studentNameList]);
    })));
  }
  fetchAllCourseName(){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/feesName')
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesNameList=response.data;
      this.feesNameSubject.next([...this.feesNameList]);
    })));
  }

  fetchAllFeesCharged($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/allFeesCharged/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllFeesDiscount($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/allFeesDiscount/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllFeesReceived($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/allFeesReceived/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.feesReceivedList=response.data;
      this.feesReceivedSubject.next([...this.feesReceivedList]);
    })));
  }
  fetchAllTransaction(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeeCharge',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.transactionList=response.data;
      this.transactionListSubject.next([...this.transactionList]);
    })));
  }

  fetchReceivedEdit(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeesReceivedEdit',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: any[]}) => {
      this.transactionList=response.data;
      this.transactionListSubject.next([...this.transactionList]);
    })));
  }

  fetchAllActiveCourse(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/getRegisterCourseByStudentId', data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchCourseId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/getCourseId', data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Student to courseList:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));

   }
  feesCharge(feeChargeData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesCharged', feeChargeData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  feesDiscountCharge(feeChargeData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesDiscountCharged', feeChargeData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  saveFeesReceive(feeReceivedData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesReceived', feeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  updateFeesCharge(id:any,updateFeeChargedData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/transactions/updateFeesCharged/' +id, updateFeeChargedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  updateFeesReceived(id:any,updateFeeReceivedData:any){
    return this.http.patch<any>(this.commonService.getAPI() + '/transactions/updateFeesReceived/' +id, updateFeeReceivedData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
  fetchFeesChargeDetailsById(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesChargedDetailsMain',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Fees Course Details:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  //----------------- Fees Received Function start -----------------------
  fetchFeesDueListId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesDueListByTranId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
 
  fetchFeesDueListEditId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/feesDueListEditByTranId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  fetchAllTranMasterId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getTranMasterId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchAllUpdateTranMasterId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/getUpdateTranMasterId',data)
    .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      //console.log("Fees Due List:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }
  fetchDiscountByTranId(data:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/allTotalDiscountByTranId',data)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  fetchFeesDueLedgerId(data:any){
     return this.http.post<any>(this.commonService.getAPI() + '/transactions/getFeesByLedgerId', data)
     .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: StudentToCourse[]}) => {
      this.studentToCourseList=response.data;
      console.log("Due list By Ledger:",this.studentToCourseList);
      this.studentToCourseSubject.next([...this.studentToCourseList]);
    })));
  }

  fetchMonthlyStudentList($orgID:any){
    return this.http.get<any>(this.commonService.getAPI() + '/transactions/getMonthlyStudent/'+$orgID)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }

  monthlyFeesCharge(feeChargeData:any){
    return this.http.post<any>(this.commonService.getAPI() + '/transactions/monthlyFeesCharged', feeChargeData)
    .pipe(catchError(this.errorService.serverError), tap(response => {
      if (response.status === true){
        this.studentToCourseList.unshift(response.data);
        this.studentToCourseSubject.next([...this.studentToCourseList]);
      }
    }))
  }
 
}
