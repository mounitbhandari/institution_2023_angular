import { Component, OnInit } from '@angular/core';
import { BijoyaRegistration } from 'src/app/models/bijoya-regitration.model';
import { BijoyaRegistrationService } from 'src/app/services/bijoya-registration.service';
import { CommonService } from 'src/app/services/common.service';
import { LitElement, html} from 'lit-element';
import 'fa-icons';
import { ReportService } from 'src/app/services/report.service';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { CourseService } from 'src/app/services/course.service';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { Table } from 'primeng/table/table';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { ToWords } from 'to-words';
import Swal from 'sweetalert2';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: { // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    }
  }
});
@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  organisationId:number=0;
  UserID:number=0;
  organisationName:string='';
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';
  organizationArray: any = [];
  monthlyStudentArray:any=[];

  whatsapp_number: string = '';
  billing_name: string = '';
  full_name: any;
  ledger_name: any;
  total_course_fees: any;
  transaction_date: any;
  transaction_number: any;
  total_discount: any;
  temp_total_received: any;
  comment: any;
  
  tempGetActiveCourseObj!:object;
  allIncomeArray: any = [];
  allBillReceiptArray: any = [];
  showReceipt:boolean=false;
  selectedIndex: number = 0;
  rupeeInWords:string='';
  totalRecepitAmount:number=0;
  birthdayArray:any=[];
  upcomingDueListArray:any=[];
  studentRegistrationHistoryArray:any=[];
  workingEndDate:any;
  workingDescription:string='';
  dateDifference:number=0;
  totalNoCourse:number=0;
  totalNoActiveStudent:number=0;
  totalMonthlyCash:number=0;
  totalMonthlyBank:number=0;
  totalYearlyBank:number=0;
  totalYearlyCash:number=0;
  totalMonthlyIncome:number=0;
  totalYearlyIncome:number=0;
  registratedData: BijoyaRegistration[]=[];
  showMessage:boolean=false;
  isDeviceXS = false;

  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
 
  constructor( private reportService: ReportService
              , private commonService: CommonService
              , private courseService: CourseService
              , private studentToCourseService: StudentToCourseService
              , private transactionServicesService: TransactionServicesService

    ) {
      this.isDeviceXS=commonService.getDeviceXs();
      const user = localStorage.getItem('user');
      if (user){
        this.UserID = JSON.parse(<string>user).uniqueId;
        this.organisationId = JSON.parse(<string>user).organisationId;
        console.log("user localUserID:",(this.UserID));
        console.log("user organisationId:",(this.organisationId));
      }
      this.getAllIncome(this.organisationId);
      this.getTotalCourse(this.organisationId);
      this.getTotalActiveStudent(this.organisationId);
      //this.getWorkingDays();
      this.getStudentBirthDay(this.organisationId);
      this.getStudentUpcomingDueList(this.organisationId);
      this.getStudentToCourseRegistrationList(this.organisationId);
      this.getAllMonthlyStudent(this.organisationId);
   
   
   
   }

  ngOnInit(): void {
    //this.organisationId=1;
    this.transactionServicesService.fetchOrganizationDetails(this.organisationId).subscribe(response => {
      this.organizationArray = response.data;
      console.log("organizationArray:", this.organizationArray);
      this.organisationName=response.data[0].organisation_name;
      this.organisationAddress=response.data[0].address;
      this.organisationPin=response.data[0].pin;
      this.organisationEmail=response.data[0].email_id;
      this.organisationContact=response.data[0].whatsapp_number;
      console.log("organisation_name:",this.organisationName);
       })
  }
  onClickedReceiptVoucher(stuToCourseId: any) {
    this.totalRecepitAmount = 0;
    this.rupeeInWords = '';
    this.showReceipt = true;
    this.selectedIndex = 2;
    
       this.tempGetActiveCourseObj={};
       this.tempGetActiveCourseObj={
           id: stuToCourseId,
           organisationId:this.organisationId
       };
    console.log("id:", stuToCourseId);
    this.transactionServicesService.fetchAllReceipt(this.tempGetActiveCourseObj).subscribe(response => {
      this.allBillReceiptArray = response.data;
      console.log("Array:", this.allBillReceiptArray);
      this.billing_name = this.allBillReceiptArray[0].billing_name;
      this.whatsapp_number = this.allBillReceiptArray[0].whatsapp_number;
      this.full_name = this.allBillReceiptArray[0].full_name;
      this.total_course_fees = this.allBillReceiptArray[0].total_course_fees;
      this.transaction_date = this.allBillReceiptArray[0].transaction_date;
      this.transaction_number = this.allBillReceiptArray[0].transaction_number;
      this.total_discount = this.allBillReceiptArray[0].total_discount;
      for (let val of this.allBillReceiptArray) {
        this.totalRecepitAmount = Number(this.totalRecepitAmount) + Number(val.temp_total_received);
      }
      this.rupeeInWords = toWords.convert(this.totalRecepitAmount);
    })

  }
  onClickedClosed() {
    this.selectedIndex = 0;
  }
  active=0;
  onTabChanged(event:any){
    console.log(event)
  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }
  saveAllStudentMonthly() {
    Swal.fire({
       title: 'Are you sure?',
       text: 'Save This Record...?',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Yes, Save it!',
       cancelButtonText: 'No, keep it'
     }).then((result) => {
       if (result.isConfirmed) {
         this.transactionServicesService.allStudentMonthlyFeesCharge(this.organisationId).subscribe(response => {
           if (response.success === 1) {
             this.getAllMonthlyStudent(this.organisationId);
             Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: 'All Fees Charged has been saved',
               showConfirmButton: false,
               timer: 1500
             });
            
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
   getAllIncome($orgID:any){
    this.reportService.fetchAllReceiptIncomeReport($orgID).subscribe(response=>{
      this.allIncomeArray=response.data;
      this.totalMonthlyCash=this.allIncomeArray[0].total_monthly_cash;
      this.totalMonthlyBank=this.allIncomeArray[0].total_monthly_bank;
      this.totalYearlyBank=this.allIncomeArray[0].total_yearly_bank;
      this.totalYearlyCash=this.allIncomeArray[0].total_yearly_cash;
      this.totalMonthlyIncome=this.allIncomeArray[0].total_monthly_income;
      this.totalYearlyIncome=this.allIncomeArray[0].total_yearly_income;
      console.log("all Income TS:",this.allIncomeArray);
    })
  }
  getAllMonthlyStudent($orgID: any) {
    this.transactionServicesService.fetchMonthlyStudentList($orgID).subscribe(response => {
      this.monthlyStudentArray = response.data;
      console.log("Monthly Student:", this.monthlyStudentArray);
    })
  }
  getTotalCourse($orgID:any){
    this.courseService.fetchAllTotalCourse($orgID).subscribe(response => {
      this.totalNoCourse = response.data[0].totalCourse;
      console.log("Monthly totalNoCourse:",this.totalNoCourse);
    })
  }
  getTotalActiveStudent($orgID:any){
    this.studentToCourseService.fetchAllTotalActiveStudent($orgID).subscribe(response => {
      this.totalNoActiveStudent = response.data[0].totalActiveStudent;
      console.log("Monthly totalNoCourse:",this.totalNoActiveStudent);
    })
  }
  getStudentBirthDay($orgID:any){
    this.reportService.fetchStudentBirthDayDaysReport($orgID).subscribe(response => {
      this.birthdayArray=response.data;
      console.log("birthdayArray:",this.birthdayArray);
    })
  }
  getStudentUpcomingDueList($orgID:any){
    this.reportService.fetchStudentUpcomingDueListReport($orgID).subscribe(response => {
      this.upcomingDueListArray=response.data;
      console.log("UpcomingDueList:",this.upcomingDueListArray);
    })
  }
 /*  getWorkingDays(){
    this.reportService.fetchWorkingDaysReport(this.organisationId).subscribe(response => {
      this.workingEndDate = response.data[0].end_date;
      this.workingDescription = response.data[0].description;
      this.dateDifference = response.data[0].date_difference;
      if(this.dateDifference<=3){
        this.showMessage=true;
      }else{
        this.showMessage=false;
      }
      console.log("dateDifference Days:",this.dateDifference);
    })
  } */
  getStudentToCourseRegistrationList($orgID:any){
    this.reportService.fetchStudentToCourseRegistrationReport($orgID).subscribe(response => {
      this.studentRegistrationHistoryArray=response.data;
      console.log("StudentToCourseRegistration:",this.studentRegistrationHistoryArray);
    })
  }


  
}
