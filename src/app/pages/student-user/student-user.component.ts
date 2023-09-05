import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';
import { StudentToCourseService } from 'src/app/services/student-to-course.service';
import { StudentService } from 'src/app/services/student.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { ToWords } from 'to-words';

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
  selector: 'app-student-user',
  templateUrl: './student-user.component.html',
  styleUrls: ['./student-user.component.scss']
})
export class StudentUserComponent implements OnInit {
  organisationId:number=0;
  AllOrgDetailsArray:any[]=[];
  AllOrgFeesChargedArray:any[]=[];
  AllOrgFeesReceivedArray:any[]=[];
  studentProfileDetalilsArray:any[]=[];
  studentCourseHistoryArray:any=[];
  UserID:number=0;
  organisationName:string='';
  studentQualification:string='';
  studentAddress:string='';
  studentPin:string='';
  studentContact:string='';
  studentEmail:string='';
  ledgerId:number=0;
  organizationArray: any = [];
  allBillReceiptArray: any = [];

  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';

  tempGetActiveCourseObj!:object;
  showReceipt:boolean=false;
  selectedIndex: number = 0;
  rupeeInWords:string='';
  totalRecepitAmount:number=0;

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
  
  constructor(private studentToCourseService: StudentToCourseService
    ,private reportService: ReportService
    ,private route: ActivatedRoute
    , public authService: AuthService
    , private activatedRoute: ActivatedRoute
    , private studentService: StudentService
    ,private transactionServicesService: TransactionServicesService) {
    const user = localStorage.getItem('user');
    if (user){
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      this.ledgerId = JSON.parse(<string>user).ledgerId;
      console.log("user localUserID:",(this.UserID));
      console.log("user organisationId:",(this.organisationId));
      console.log("Ledger id:",(this.ledgerId));
    }
    this.getStudentProfile(this.ledgerId);
    this.getStudentToCourseRegistrationListLedgerId(this.ledgerId);
   }
  ngOnInit(): void {
  }
  onTabChanged(event:any){
    console.log(event)
  }
  getStudentProfile($ledgerID: any) {
     this.studentService.fetchStudentProfile($ledgerID).subscribe(response => {
      this.studentProfileDetalilsArray = response.data;
      this.organisationName=this.studentProfileDetalilsArray[0].organisation_name;
      this.studentAddress=this.studentProfileDetalilsArray[0].address;
      this.studentPin=this.studentProfileDetalilsArray[0].pin;
      this.studentContact=this.studentProfileDetalilsArray[0].whatsapp_number;
      this.studentEmail=this.studentProfileDetalilsArray[0].email_id;
      this.studentQualification=this.studentProfileDetalilsArray[0].qualification;
      this.organisationAddress=this.studentProfileDetalilsArray[0].organisationAddress;
      this.organisationPin=this.studentProfileDetalilsArray[0].organisationPin;
      this.organisationContact=this.studentProfileDetalilsArray[0].organisationContact;
      this.organisationEmail=this.studentProfileDetalilsArray[0].organisationEmail;
      console.log("studentProfileDetalilsArray :", this.studentProfileDetalilsArray);
    }) 
  }
  clear(table: Table) {
    table.clear();
  } 
  getEventValue($event:any) :string {
    return $event.target.value;
  }
  getStudentToCourseRegistrationListLedgerId($ledgerID:any){
    this.reportService.fetchStudentToCourseRegistrationReportLedgerId($ledgerID).subscribe(response => {
      this.studentCourseHistoryArray=response.data;
      console.log("studentCourseHistoryArray:",this.studentCourseHistoryArray);
    })
  }
  btnPayNow(){
    alert("Working On Progress...")
  }
  onClickedPaymentVoucher(stuToCourseId: any){

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
    this.selectedIndex = 1;
  }
  onActivePayment(){
    this.selectedIndex = 1;
  }
  onActiveGallery(){
    this.selectedIndex = 3;
  }
  onActiveAcademic(){
    this.selectedIndex = 0;
  }
}
