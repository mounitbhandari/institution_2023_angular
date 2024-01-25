import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
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

  buttonColor = "black";
  buttonType = "buy";
  isCustomSize = false;
  buttonWidth = 240;
  buttonHeight = 40;
  isTop = window === window.top;

  fullCourseName:string='';
  feesName:string='';
  paymentAmount:number=0;

  transactionId:number=0;
  transactionDate:string='';

  tempPhonepeObj!: object;
  tempGetActiveCourseObj!: object;

  tempItemObj!: object;
  tempSaveItemObj!: object;
  tempObj!: object;
  tempChargeObj!: object;
  tempReceicedObj!: object;
  tempReceicedObj_1!: object;
  tempCashChargeObj!: object;

  organisationId:number=0;
  PhonepePaymentHistoryarray:any[]=[];
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
  studentNewsArray:any[]=[];
  allBillReceiptArray: any = [];
  tranMasterIdArray:any=[]
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';

  FinalPayFormGroup: FormGroup | any;
  tempFeesReceivedArray:any[]=[];
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
  defaultPicture: string = "";
  payAmountNgModel: number = 0;
  tempNewsObj:object={};
  constructor(private studentToCourseService: StudentToCourseService,
    private commonService: CommonService
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
    //this.getStudentNewsList(this.organisationId);
   }
  
  ngOnInit(): void {
    this.defaultPicture = this.commonService.getPublic() + '/file_upload/';
    this.FinalPayFormGroup = new FormGroup({
      payAmount: new FormControl(null, [Validators.required]),
    })
  }
  onTabChanged(event:any){
    console.log(event)
  }
  onLoadPaymentData(event:any) {
    console.log("load payment data", event.detail);
  }//hjrghfsghsdg
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
      this.tempNewsObj = {
        courseId: this.studentCourseHistoryArray[0].course_id,
        organisationId: this.organisationId
      }; 
      console.log("course ID:",this.tempNewsObj);
      this.getStudentNewsList();
    })
  }
  btnPayNow(data:any){
    this.selectedIndex = 4;
    console.log("data:",data)
    this.fullCourseName=data.full_name;
    this.tempGetActiveCourseObj = {
      id: data.id,
      organisationId: this.organisationId
    };
    this.transactionServicesService.fetchAllTranMasterId(this.tempGetActiveCourseObj).subscribe(response => {
      this.tranMasterIdArray = response.data;
      console.log("tranMasterIdArray:",this.tranMasterIdArray);

    })
  }
  getStudentNewsList(){
    this.reportService.fetchStudentNewsListReport(this.tempNewsObj).subscribe(response => {
      this.studentNewsArray=response.data;
      console.log("studentNewsArray:",this.studentNewsArray);
    })
  }
  /* onPayment(data:any){
    console.log(data);
  } */
  onFinalPayNow(){
    this.paymentAmount = this.payAmountNgModel;
    console.log("amount:",this.paymentAmount);
    let testUrl=this.commonService.getAPI() + '/phonepe/'+this.paymentAmount;
    //window.location.href='http://localhost/institution_2023/institution_2023_api/public/api/phonepe/'+this.paymentAmount;
    window.location.href=testUrl;
   /*  this.tempPhonepeObj = {
      amount: this.paymentAmount
    }; */
    /* console.log("amount:",this.paymentAmount);
    this.transactionServicesService.fetchPhonepeApi(this.paymentAmount).subscribe(response => {
      this.PhonepePaymentHistoryarray = response.data;
      console.log("PhonepePaymentHistoryarray:",this.PhonepePaymentHistoryarray);

    })  */
  }
  onPayment(data:any) {
    this.selectedIndex = 5;
    console.log("Final Payment data:",data);
    this.transactionId=data.id;
    this.transactionDate=data.transaction_date;
    this.feesName=data.ledger_name;
    this.paymentAmount=data.total_due;
    this.payAmountNgModel=data.total_due;
   /*  let mode;
    this.tempReceicedObj = {};
    this.tempFeesReceivedArray = [];
    this.transactionMasterId = this.FeesReceivedFormGroup.get('transactionMasterId')?.value;
    let tr_date = this.FeesReceivedFormGroup.get('transactionDate')?.value;
    this.amount = this.FeesReceivedFormGroup.get('amount')?.value;
    this.ledgerId = this.FeesReceivedFormGroup.get('ledgerId')?.value;
    if (this.ledgerId === 1) {
      mode = 'Cash'
    } else {
      mode = 'Bank'
    }
    this.transactionDate = formatDate(tr_date, 'yyyy-MM-dd', 'en');
    console.log("TrId.", this.transactionMasterId);
    console.log("amount.", this.amount);
    console.log("ledgerId.", this.ledgerId);
    Swal.fire({
      title: 'Are you sure?',
      html: '<pre> Date:' + this.transactionDate + '</pre>' + '<br><pre> Amount:' + this.amount + '</pre>' + '<br><pre>Payment Mode:' + mode + '</pre>',
      text: ' Save This Record...?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {


        this.studentId = this.FeesReceivedFormGroup.get('studentId')?.value;


        var DateObj = new Date(this.transactionDate);
        this.transactionMonth = DateObj.getMonth() + 1;
        this.transactionYear = DateObj.getFullYear();
        console.log("Month No:", DateObj.getMonth() + 1);
        console.log("Year No:", DateObj.getFullYear());
        this.comment = this.FeesReceivedFormGroup.get('comment')?.value;
        if (!this.comment) {
          this.comment = "Fees Received";
        }

        this.tempChargeObj = {
          ledgerId: this.studentId,
          transactionTypeId: 2,
          amount: this.amount
        }
        this.tempReceicedObj = {
          ledgerId: this.ledgerId,
          transactionTypeId: 1,
          amount: this.amount
        }

        this.tempFeesReceivedArray.push(this.tempReceicedObj);


        this.tempFeesReceivedArray.push(this.tempChargeObj);
        this.tempObj = {
          transactionMaster: {
            userId: this.UserID,
            referenceTransactionMasterId: this.studentToCourseId,
            transactionDate: this.transactionDate,
            comment: this.comment,
            feesYear: this.transactionYear,
            feesMonth: this.transactionMonth,
            organisationId: this.organisationId
          },
          transactionDetails: Object.values(this.tempFeesReceivedArray)
        }
        this.transactionServicesService.saveFeesReceive(this.tempObj).subscribe(response => {
          if (response.success === 1) {
            this.transactionId = response.data.transactionMasterId;
            
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Fees Received has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            
           
            this.FeesReceivedFormGroup.reset();
            //this.getActiveCourseUpdate();
            this.clearFeesReceived();
            this.isPrintBoolean = true;
            this.getAllReceivedFees(this.organisationId);
            this.feesDueListArray = [];
            this.totalAmount = 0;
            this.getAllStudent(this.organisationId);
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
    }) */

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
  //rzp1: any
  /* pay(){
    this.rzp1 = new this.studentService.nativeWindow.Razorpay(this.options);
    this.rzp1.open();
  } */
  /*   options = {
      "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
      "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Acme Corp", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response: { razorpay_payment_id: any; razorpay_order_id: any; razorpay_signature: any; }){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
      },
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          "name": "Gaurav Kumar", //your customer's name
          "email": "gaurav.kumar@example.com", 
          "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      }
  }; */
}
