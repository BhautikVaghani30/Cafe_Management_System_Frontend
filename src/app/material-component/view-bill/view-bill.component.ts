import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { DataService } from 'src/app/services/data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = [
    'uuid',
    'name',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];
  dataSource: any;
  responseMessage: any;

  constructor(
    private dialog: MatDialog,
    private billService: BillService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData(); // load data from db
  }

  tableData() {
    // retrieve the bills from the backend
    this.billService.getBills().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // open the bill for viewing via ViewBillProductsComponent
  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
    };
    dialogConfig.width = '100%';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + "'s bill",
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteBill(values.id);
        dialogRef.close();
      }
    );
  }

  deleteBill(id: any) {
    // delete from backend via the bill's id
    this.billService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData(); // reload the table
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);

        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  // handleEditAction(element: any) {
  //   this.dataService.setSharedData(element);
  //   this.router.navigate(['/cafe/order', element.uuid]);
  // }

  handleDownloadAction(values: any) {
    this.ngxService.start();
    // retrieve the attributes
    var data = {
      name: values.name, //delete email
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total.toString(),
      productDetails: values.productDetail,
    };
    this.downloadFile(values.uuid, data); // pass through downloadFile
  }

  downloadFile(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe((response: any) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    });
  }
}
