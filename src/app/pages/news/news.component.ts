import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ReportService } from 'src/app/services/report.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  UserID: number = 0;
  organisationId: number = 0;
  newsFormGroup!: FormGroup;
  newsSaveData!: object;
  newsDataArray:any[]=[];
  activeStatus:number=1;
  inActiveStatus:number=0;
  itemValue!: object;
  constructor(private reportService: ReportService) { 

    const user = localStorage.getItem('user');
    if (user) {
      this.UserID = JSON.parse(<string>user).uniqueId;
      this.organisationId = JSON.parse(<string>user).organisationId;
      console.log("user localUserID:", (this.UserID));
      console.log("user organisationId:", (this.organisationId));
    }
    this.getNewsList(this.organisationId);
  }
  selectedIndex=0;
  onTabChanged(event:any){
    console.log(event)
  }
  ngOnInit(): void {
    this.newsFormGroup = new FormGroup({
      newsDescription: new FormControl(null, [Validators.required])
    })
  }
  saveNews() {
    //alert("Testing");
    this.newsDataArray=[];
    Swal.fire({
      title: 'Are you sure?',
      text: 'To Save This Record!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
      this.newsSaveData = {
          newsDescription: this.newsFormGroup.value.newsDescription,
          organisationId: this.organisationId
        }
        this.reportService.saveNews(this.newsSaveData).subscribe(response => {
          //this.showError = response.exception;
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'News has been saved',
              showConfirmButton: false,
              timer: 1500
            });
           
            this.getNewsList(this.organisationId);
            this.newsFormGroup = new FormGroup({
              newsDescription: new FormControl(null, [Validators.required])
            })
            // this.showSuccess("Record added successfully");
            
            //console.log("success:",response.success);
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Course Code..!!',
            text: error,
            footer: '<a href>Why do I have this issue?</a>' ,
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
  onChange(status:number,id:any) {
    
    this.itemValue={
      id:id,
      inforce:status
    }
    Swal.fire({
      text: '',
      title: 'Are you sure ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.reportService.updateNewsStatus(this.itemValue).subscribe(
          (response: { success: number; }) => {
          if (response.success === 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'News Status has been Updated..',
              showConfirmButton: false,
              timer: 1500
            });
            this.getNewsList(this.organisationId);
            // this.showSuccess("Record added successfully");
            
            //console.log("success:",response.success);
          }
          }, (error: any) => {
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
  editNews(data:any){
    console.log("newsDataEdit:", data);
  }
  deleteNews(data:any){
    console.log("newsDataDelete:", data);
  }
  getNewsList($orgID: any) {
    this.reportService.fetchNewsListReport($orgID).subscribe(response => {
      this.newsDataArray = response.data;
      console.log("newsDataArray:", this.newsDataArray);
    })
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }
  clear(table: Table) {
    table.clear();
  } 

}
