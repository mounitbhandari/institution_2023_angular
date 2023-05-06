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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  organisationId:number=0;
  UserID:number=0;
  organisationName:string='';
  organisationAddress:string='';
  organisationPin:string='';
  organisationContact:string='';
  organisationEmail:string='';
  organizationArray: any = [];
  comfirmPasswordBoolean: boolean=false;
  isBtnVisible:boolean=false;
  password:any;
  changePasswordFormGroup!: FormGroup;
  changePasswordData:object | undefined;
  constructor( private reportService: ReportService
    , private commonService: CommonService
    , private courseService: CourseService
    , private studentToCourseService: StudentToCourseService
    , private transactionServicesService: TransactionServicesService
    , private authService: AuthService

) {

const user = localStorage.getItem('user');
if (user){
this.UserID = JSON.parse(<string>user).uniqueId;
this.organisationId = JSON.parse(<string>user).organisationId;
console.log("user localUserID:",(this.UserID));
console.log("user organisationId:",(this.organisationId));
}
 }

  ngOnInit(): void {
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

       this.changePasswordFormGroup = new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
        confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
       })
  }

  onClear(){
    this.isBtnVisible=false;
    this.changePasswordFormGroup = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      confirm_password: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
    })
  }

  onBlur(event:any): void {
    this.password = this.changePasswordFormGroup.get('password')?.value;
    console.log('confirm password:',event.target.value);
    console.log('password:',this.password);
    if(this.password===event.target.value){
      this.comfirmPasswordBoolean=true;
    }
    else{
      this.comfirmPasswordBoolean=false;
    }
    
  }
  onUpdatePassword() {
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.changePasswordFormGroup.value.password).end();
    this.changePasswordData={
      userId:this.UserID,
      password: passwordMd5
    }
     Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.authService.changePasswordUser(this.changePasswordData).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Password has been Changed!',
              showConfirmButton: false,
              timer: 1500
            });
            
            this.onClear();
            // this.showSuccess("Record added successfully");

          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Entry ..!!',
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


}
