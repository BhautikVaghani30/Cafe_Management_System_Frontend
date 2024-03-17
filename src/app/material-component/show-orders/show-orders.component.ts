import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { RouteGuardService } from 'src/app/services/route-guard.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.scss']
})
export class ShowOrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'bill_uuid',
    'category',
    'price',
    'productName',
    'quantity',
    'tablenumber',
    'total',
    'orderStatus',
    'view',
  ];
  
  dataSource: any;
  responseMessage: any;
  categoryData:any;

  constructor(
    private billService: BillService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private routeGuardService:RouteGuardService
  ) {}
  ngOnInit(): void {
  
    this.ngxService.start();
    this.tableData(); // load data from db
    this.category();
  }

  
  public category()
  {
    this.categoryService.getCategories().subscribe((res: any)=>{
      if(res != null)
      {
        this.categoryData = res;
      }
    }) 
  }



  onCategorySelected(event: MatSelectChange) {
    const selectedFood = event.value; // This will give you the selected food object
    // const selectedFoodName = selectedFood.name; // Extracting the name from the selected food object
    // console.log('Selected food name:', selectedFood.value);

    this.billService.getOrdersByCategory(selectedFood).subscribe((res:any)=>{
      if(res!= null)
      {
        console.log(res);
        this.dataSource = res;
      }else{
        this.dataSource = [];
      }
    },(error) => { 
      this.dataSource = [];
    })
  }


  tableData() {
    // retrieve the bills from the backend
    this.billService.getOrders().subscribe(
      (response: any) => {
        this.ngxService.stop();
        
        this.dataSource = new MatTableDataSource(response);
        console.log(this.dataSource);
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

  onOrderStatusChange(element:any){
    
    this.billService.updateOrderStatus({
      id:element.id,
      orderStatus:`${element.orderStatus}`
    }).subscribe(
      (response: any) => {
        
        this.ngxService.start();
        this.tableData(); // l
        this.snackbarService.openSnackBar(
          response.message,
          'success'
        );
        
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
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleDeleteAction(element:any){

    this.billService.deleteOrder(element.id).subscribe(
      (response: any) => {
        
        this.ngxService.start();
        this.tableData(); // l
        this.snackbarService.openSnackBar(
          response.message,
          'success'
        );
        
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
    )
  }

  getRole():string | undefined{
    return this.routeGuardService.getRole();
  }

}
