import { Component, OnInit } from '@angular/core';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidenav-owner',
  templateUrl: './sidenav-owner.component.html',
  styleUrls: ['./sidenav-owner.component.scss']
})
export class SidenavOwnerComponent implements OnInit {
  faAddressBook = faAddressBook;
  displayMaster=false;
  displayMaster_1=false;
  displayReport=false;
  constructor() { }

  ngOnInit(): void {
  }
  toggleMaster(){
    this.displayMaster_1=false;
    this.displayMaster=!this.displayMaster;
    this.displayReport=false;
  }
  toggleMaster_transaction(){
    this.displayMaster=false;
    this.displayMaster_1=!this.displayMaster_1;
    this.displayReport=false;
  }
  toggleMaster_report(){
    this.displayMaster=false;
    this.displayMaster_1=false;
    this.displayReport=!this.displayReport;
  }
}
