import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from "@angular/router";
import { Student } from "../../models/student.model";
import { StudentService } from "../../services/student.service";
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { environment } from "../../../environments/environment";
import { WebcamImage, WebcamInitError } from "ngx-webcam";
import { AuthService } from "../../services/auth.service";
import { CommonService } from "../../services/common.service";
import { ageGTE } from "../../custom-validator/age.validator";
import { Observable } from "rxjs";
import { filter, map, startWith } from 'rxjs/operators';
import { StorageMap } from "@ngx-pwa/local-storage";
import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2'

interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [ConfirmationService, MessageService, DatePipe]

})


export class StudentComponent implements OnInit, OnChanges {

  myControl = new FormControl();
  qualifications: string[] = ['Graduate', 'Class V', 'Class VI', 'Class VII', 'Class VIII'];
  filteredQualifications: Observable<string[]> | undefined;
  error: any;
  loginType: any;
  students: Student[] = [];
  organisationId: number = 0;
  msgs: { severity: string; summary: string; detail: string }[] = [];
  value3: any;
  data: any;
  displayDialog: boolean = false;
  isDeviceXS = false;
  event: any;
  items: MenuItem[] = [];

  activeIndex: number = 0;
  userData: any;
  userObject!: Object;
  UserID: any;
  studentNameFormGroup: FormGroup;
  studentGuardianFormGroup: FormGroup;
  studentBasicFormGroup: FormGroup;
  studentAddressFormGroup: FormGroup;
  studentContactFormGroup: FormGroup;
  isLinear: boolean = false;
  relations: any[];
  sex: any[];
  genders: any[];
  alerts: Alert[] = [];
  billingName: string = '';
  guradainName: string = '';
  isProduction = environment.production;
  showDeveloperDiv = true;
  isCaptured: boolean = true;
  WIDTH = 200;
  HEIGHT = 200;
  date: any;
  public webcamImage: WebcamImage | undefined;
  dialogContent: string = "";
  optionSelected: any = '';
  stateSelected: any = '';
  guardianName: any = '';
  studentData: {
    studentId?: any;
    episodeId?: string;
    studentName?: string;
    billingName?: string;
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    relationToGuardian?: string;
    dob?: string;
    sex?: string;
    address?: string;
    city?: string;
    district?: string;
    stateId?: string;
    pin?: string;
    guardianContactNumber?: string;
    whatsappNumber?: string;
    email?: string;
    qualification?: string;
    userID?: number;
    organisationId?: number;
  } = {};
  stateList: any[] = [];
  visibleSidebar2: boolean = false;
  errorMessage: any;
  showErrorMessage: boolean = false;
  isShown: boolean = false; // hidden by default
  hiddenInput: boolean = false;
  constructor(private route: ActivatedRoute
    , public authService: AuthService
    , private messageService: MessageService
    , private activatedRoute: ActivatedRoute
    , private studentService: StudentService
    , private confirmationService: ConfirmationService
    , private primengConfig: PrimeNGConfig
    , private storage: StorageMap
    , private commonService: CommonService
    , public datepipe: DatePipe
  ) {

    this.storage.get('studentNameFormGroup').subscribe((studentNameFormGroup: any) => {
      if (studentNameFormGroup) {
        this.studentNameFormGroup.setValue(studentNameFormGroup);
      }
    }, (error) => { });

    this.storage.get('studentGuardianFormGroup').subscribe((studentGuardianFormGroup: any) => {
      if (studentGuardianFormGroup) {
        this.studentGuardianFormGroup.setValue(studentGuardianFormGroup);
      }
    }, (error) => { });

    this.storage.get('studentBasicFormGroup').subscribe((studentBasicFormGroup: any) => {
      if (studentBasicFormGroup) {
        this.studentBasicFormGroup.setValue(studentBasicFormGroup);
      }
    }, (error) => { });


    /*  this.studentService.fetchEducations().then(educations => {
       this.qualifications = educations;
     }); */

    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];


    this.route.data.subscribe((response: any) => {
      this.stateList = response.studentResolverData.states.data;
    });

    this.genders = [
      { name: 'M', value: 'M', icon: 'bi bi-gender-male', tooltip: 'Male' },
      { name: 'F', value: 'F', icon: 'bi bi-gender-female', tooltip: 'Female' },
      { name: 'T', value: 'T', icon: 'bi bi-gender-trans', tooltip: 'Others' }
    ];

    this.relations = [
      { name: 'Father' },
      { name: 'Mother' },
      { name: 'Dadu' },
      { name: 'Dida' }
    ];

    this.sex = [
      { name: 'Male' },
      { name: 'Female' },
      { name: 'Others' },

    ];
    this.studentNameFormGroup = new FormGroup({
      studentId: new FormControl(null),
      episodeId: new FormControl(null),
      studentName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      billingName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)])
    });
    this.studentGuardianFormGroup = new FormGroup({
      fatherName: new FormControl(null),
      motherName: new FormControl(null),
      guardianName: new FormControl(null),
      relationToGuardian: new FormControl(null, [Validators.required])
    });

    this.studentBasicFormGroup = new FormGroup({
      dob: new FormControl(null, [Validators.required, ageGTE(4)]),
      dobSQL: new FormControl(null),
      sex: new FormControl(null, Validators.required),
      qualification: new FormControl(null, Validators.required)
    });
    this.studentAddressFormGroup = new FormGroup({
      address: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      district: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      stateId: new FormControl(20),
      pin: new FormControl(null)

    });

    this.studentContactFormGroup = new FormGroup({
      guardianContactNumber: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      description: new FormControl(null)
    });

  }
  active = 0;
  selectedIndex = 0;
  onTabChanged(event: any) {
    console.log(event)
  }
  clear(table: Table) {
    table.clear();
  }
  /* getEventValue($event:any) :string {
    return $event.target.value;
  } */
  isValidForm() {
    if (this.studentNameFormGroup.valid && this.studentGuardianFormGroup.valid && this.studentBasicFormGroup.valid && this.studentAddressFormGroup.valid && this.studentContactFormGroup.valid) {
      return true;

    } else {
      return false;

    }
  }

  showDialog() {
    this.dialogContent = "Student Picture Saved";
    this.displayDialog = true;
  }
  sameAsBillName() {
    this.studentNameFormGroup.patchValue({ billingName: this.studentNameFormGroup.value.studentName });

  }
  guardianAsFather(father: any) {
    this.guardianName = '';
    this.guardianName = father;
    console.log(this.guardianName);
    this.optionSelected = 'Father';
    this.studentGuardianFormGroup.patchValue({ guardianName: this.guardianName });
    this.studentGuardianFormGroup.patchValue({ relationToGuardian: this.optionSelected });
  }
  guardianAsMother(mother: any) {
    this.guardianName = '';
    this.guardianName = mother;
    console.log(this.guardianName);
    this.optionSelected = 'Mother';
    this.studentGuardianFormGroup.patchValue({ guardianName: this.guardianName });
    this.studentGuardianFormGroup.patchValue({ relationToGuardian: this.optionSelected });
  }
  editStudent(studentData: any) {
    this.selectedIndex = 0;
    this.event = 0;
    this.onTabChanged(this.event);
    this.date = new Date();
    //const latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    const latest_date1 = this.datepipe.transform(this.date, 'dd-MM-yyyy');
    console.log("convert date:", latest_date1);

    console.log("Editable data:", studentData);
    this.isShown = true;
    this.studentNameFormGroup.patchValue({ studentId: studentData.studentId });
    this.studentNameFormGroup.patchValue({ episodeId: studentData.episodeId });

    this.studentNameFormGroup.patchValue({ studentName: studentData.studentName });
    this.studentNameFormGroup.patchValue({ billingName: studentData.billingName });

    this.studentGuardianFormGroup.patchValue({ fatherName: studentData.fatherName });
    this.studentGuardianFormGroup.patchValue({ motherName: studentData.motherName });
    this.studentGuardianFormGroup.patchValue({ guardianName: studentData.guardianName });


    //this.studentBasicFormGroup.patchValue({dob: this.datepipe.transform(studentData.dobSQL, 'yyyy-MM-dd')});

    this.date = new Date(studentData.dob);
    this.studentBasicFormGroup.patchValue({ dob: this.date });

    this.studentBasicFormGroup.patchValue({ sex: studentData.sex });
    this.studentBasicFormGroup.patchValue({ qualification: studentData.qualification });

    this.studentAddressFormGroup.patchValue({ address: studentData.address });
    this.studentAddressFormGroup.patchValue({ city: studentData.city });
    this.studentAddressFormGroup.patchValue({ district: studentData.district });
    this.studentAddressFormGroup.patchValue({ stateId: studentData.stateId });
    this.studentAddressFormGroup.patchValue({ pin: studentData.pin });

    this.studentContactFormGroup.patchValue({ guardianContactNumber: studentData.guardianContactNumber });
    this.studentContactFormGroup.patchValue({ whatsappNumber: studentData.whatsappNumber });
    this.studentContactFormGroup.patchValue({ email: studentData.email });
    this.studentContactFormGroup.patchValue({ description: studentData.description });
  }
  ngOnInit(): void {

    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    /* this.userData=localStorage.getItem('user');
    console.log("user data:",(this.userData));
    this.userObject=JSON.parse(this.userData);
   
    console.log("user login data:",((Object.values(this.userObject)))); */
    // @ts-ignore
    /* this.filteredQualifications = this.studentBasicFormGroup.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    ); */

    this.students = this.studentService.getStudents();
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) => {
      this.students = response;
    });

    // this.studentService.fetchAllStates().subscribe((response:any)=>{
    //   this.stateList=response.data;
    //   console.log(this.stateList);
    // })
    this.primengConfig.ripple = true;
    this.optionSelected = 'Father';
    this.stateSelected = 20;

    this.items = [{
      label: 'Personal',
      command: (event: any) => {
        this.activeIndex = 0;
        this.messageService.add({ severity: 'info', summary: 'First Step', detail: event.item.label });
      }
    },
    {
      label: 'Seat',
      command: (event: any) => {
        this.activeIndex = 1;
        this.messageService.add({ severity: 'info', summary: 'Seat Selection', detail: event.item.label });
      }
    },
    {
      label: 'Payment',
      command: (event: any) => {
        this.activeIndex = 2;
        this.messageService.add({ severity: 'info', summary: 'Pay with CC', detail: event.item.label });
      }
    },
    {
      label: 'Confirmation',
      command: (event: any) => {
        this.activeIndex = 3;
        this.messageService.add({ severity: 'info', summary: 'Last Step', detail: event.item.label });
      }
    }
    ];

    this.ngOnChanges();
  }
  deleteStudent(studentData: any) {
    this.confirmationService.confirm({
      message: 'Do you want to Update this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //const index: number = this.myArray.indexOf(value);
        //this.myArray.splice(index, 1);
        const index: number = this.students.indexOf(studentData.studentId);
        this.studentService.deleteStudent(studentData.studentId).subscribe(response => {
          this.showSuccess("Record Deleted successfully");
          let index = this.students.findIndex(x => x.studentId === studentData.studentId);
          if (index !== -1) {
            this.students.splice(index, 1);
          }

        }, error => {
          this.showErrorMessage = true;
          this.errorMessage = error.message;
          const alerts: Alert[] = [{
            type: 'success',
            message: this.errorMessage,
          }]
          setTimeout(() => {
            this.showErrorMessage = false;
          }, 20000);
          this.showError(error.statusText);
        })

      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }
  updateStudent() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Update This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentData.studentId = this.studentNameFormGroup.value.studentId;
        this.studentData.episodeId = this.studentNameFormGroup.value.episodeId;
        this.studentData.studentName = this.studentNameFormGroup.value.studentName;
        this.studentData.billingName = this.studentNameFormGroup.value.billingName;
        this.studentData.fatherName = this.studentGuardianFormGroup.value.fatherName;
        this.studentData.motherName = this.studentGuardianFormGroup.value.motherName;
        this.studentData.guardianName = this.studentGuardianFormGroup.value.guardianName;
        this.studentData.relationToGuardian = this.studentGuardianFormGroup.value.relationToGuardian;

        //this.studentData.dob=this.studentBasicFormGroup.value.dobSQL;
        this.studentData.dob = this.studentBasicFormGroup.value.dobSQL;
        this.studentData.sex = this.studentBasicFormGroup.value.sex;
        this.studentData.qualification = this.studentBasicFormGroup.value.qualification;

        this.studentData.address = this.studentAddressFormGroup.value.address;
        this.studentData.city = this.studentAddressFormGroup.value.city;

        this.studentData.district = this.studentAddressFormGroup.value.district;
        this.studentData.stateId = this.studentAddressFormGroup.value.stateId;
        //this.studentData.stateId='10';
        this.studentData.pin = this.studentAddressFormGroup.value.pin;

        this.studentData.guardianContactNumber = this.studentContactFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber = this.studentContactFormGroup.value.whatsappNumber;
        this.studentData.email = this.studentContactFormGroup.value.email;

        this.studentService.updateStudent(this.studentData).subscribe(response => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Student has been Updated',
              showConfirmButton: false,
              timer: 1500
            });

            this.clearStudent();

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

  saveStudent() {
    //console.log("jhjkhj");
    Swal.fire({
      title: 'Are you sure?',
      text: 'Save This Record...?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentData.studentName = this.studentNameFormGroup.value.studentName;
        this.studentData.billingName = this.studentNameFormGroup.value.billingName;
        this.studentData.fatherName = this.studentGuardianFormGroup.value.fatherName;
        this.studentData.motherName = this.studentGuardianFormGroup.value.motherName;
        this.studentData.guardianName = this.studentGuardianFormGroup.value.guardianName;
        this.studentData.relationToGuardian = this.studentGuardianFormGroup.value.relationToGuardian;

        this.studentData.dob = this.studentBasicFormGroup.value.dobSQL;
        this.studentData.sex = this.studentBasicFormGroup.value.sex;
        this.studentData.qualification = this.studentBasicFormGroup.value.qualification;

        this.studentData.address = this.studentAddressFormGroup.value.address;
        this.studentData.city = this.studentAddressFormGroup.value.city;

        this.studentData.district = this.studentAddressFormGroup.value.district;
        this.studentData.stateId = this.studentAddressFormGroup.value.stateId;
        this.studentData.pin = this.studentAddressFormGroup.value.pin;

        this.studentData.guardianContactNumber = this.studentContactFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber = this.studentContactFormGroup.value.whatsappNumber;
        this.studentData.email = this.studentContactFormGroup.value.email;
        this.studentData.organisationId = this.organisationId;

        this.studentService.saveStudent(this.studentData).subscribe(response => {

          if (response.status === true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Student has been saved',
              showConfirmButton: false,
              timer: 1500
            });
            // this.showSuccess("Record added successfully");
            this.clearStudent();

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
  clearStudent() {
    this.isShown = false;
    this.studentNameFormGroup.reset();
    this.studentGuardianFormGroup.reset();
    this.studentBasicFormGroup.reset();
    this.studentAddressFormGroup.reset();
    this.studentContactFormGroup.reset();
  }





  getEventValue($event: any): string {
    return $event.target.value;
  }

  setDobSQL(value: string) {
    this.studentBasicFormGroup.patchValue({ dobSQL: this.commonService.getSQLDate(value) });
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  saveUserImage() {
    if (this.webcamImage) {
      const arr = this.webcamImage.imageAsDataUrl.split(",");
      // @ts-ignore
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file: File = new File([u8arr], "test", { type: "jpeg" })
      this.authService.uploadStudentImage(file).subscribe((response) => {
        console.log(response);
        if (response.status === true) {
          this.showSuccess("Image saved");
        }
      }
      );
    }
  }



  showSuccess(successMessage: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: successMessage });
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Success', detail: message });
  }

  /* private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.qualifications.filter(option => option.toLowerCase().includes(filterValue));
  } */

  ngOnChanges(): void {
    this.studentNameFormGroup.valueChanges.subscribe(val => {
      this.storage.set('studentNameFormGroup', this.studentNameFormGroup.value).subscribe(() => { });
    });

    this.studentGuardianFormGroup.valueChanges.subscribe(val => {
      this.storage.set('studentGuardianFormGroup', this.studentGuardianFormGroup.value).subscribe(() => { });
    });

    this.studentBasicFormGroup.valueChanges.subscribe(val => {
      this.storage.set('studentBasicFormGroup', this.studentBasicFormGroup.value).subscribe(() => { });
    });


  }


}


