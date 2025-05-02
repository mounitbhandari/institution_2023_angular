import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from "primeng/api";
import { CommonService } from 'src/app/services/common.service';
import { TransactionServicesService } from 'src/app/services/transaction-services.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToWords } from 'to-words';
import { Table } from 'primeng/table/table';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  PaymentFormGroup: FormGroup | any;
  transactionDate: any;
  paymentHeadArray: any[] = [];
  constructor(private transactionServicesService: TransactionServicesService,
       public commonService: CommonService,
    public dialog: MatDialog) {
    /* this.activatedRoute.data.subscribe((response: any) => {
      this.studentNameList = response.feesReceivedResolver.students.data;
      this.feesNameList = response.feesReceivedResolver.feesNames.data;
    }); */
    this.getAllPaymentHead();
  }
  selectedIndex: number = 0;
  ngOnInit(): void {
    const now = new Date();
    let val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.PaymentFormGroup = new FormGroup({
      transactionDate: new FormControl(val),
      PaymentId: new FormControl(null, [Validators.required]),
    })
  }
  onTabChanged(event: any) {

  }
  getAllPaymentHead() {
    this.transactionServicesService.fetchAllPaymentHead().subscribe(response => {
      this.paymentHeadArray = response.data;
    })
  }
}
