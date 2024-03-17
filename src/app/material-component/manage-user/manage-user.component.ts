import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber','role', 'status'];
  dataSource:any;
  responseMessage:any;

  constructor(private userService:UserService,
    private snackbarService:SnackbarService,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    // retrieve all users from db
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(status:any, id:any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }
    console.log(data);
    // update status of user to the backend
    this.userService.update(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
  updateUserRole(user: any) {
    this.ngxService.start();
    const requestBody = { id: user.id, role: user.role };

    this.userService.updateUserRole(requestBody).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'success');
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error.error?.message);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }
 
}
