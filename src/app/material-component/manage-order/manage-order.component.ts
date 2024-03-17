import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Checkout } from 'capacitor-razorpay';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { DataService } from 'src/app/services/data.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'edit',
  ];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;
  RAZOR_KEY = 'rzp_test_DqGMseHxxRaQMg';
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private billService: BillService,
    private snackbarService: SnackbarService,
    private dataService: DataService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategories();

    // required data from the user
    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      tableNumber: [null, [Validators.required, Validators.required]],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      paymentMethod: [null, [Validators.required]],
      /* paymentStatus: [null, [Validators.required]], */
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });

    const data = this.dataService.getSharedData();
    if (data) {
      this.manageOrderForm.patchValue(data);
      this.manageOrderForm.controls['paymentMethod'].value = data.paymentMethod;
      console.log(data);
    }
  }

  getCategories() {
    this.categoryService.getFilteredCategories().subscribe(
      (response: any) => {
        console.log(response);
        this.ngxService.stop();
        this.categories = response;
      },
      (error: any) => {
        console.log(error);
        this.ngxService.stop();
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
  managePayment(value: any) {
    console.log(value);
  }

  // retrieves products based on a category
  getProductsByCategory(value: any) {
    // get data from backend
    this.productService.getProductsByCategory(value.id).subscribe(
      (response: any) => {
        this.products = response;
        console.log(response);
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      },
      (error: any) => {
        console.log(error);
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

  // retrieve product data
  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe(
      (response: any) => {
        this.price = response.price;
        // initialize the form values when user selects a product
        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      (error: any) => {
        console.log(error);
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

  // if user changes the quantity of the product, update the total price accordingly
  setQuantity(val: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    }
  }

  // ensure that all fields are filled out
  validateProductAdd() {
    if (
      this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (
      this.totalAmount === 0 ||
      this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['tableNumber'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;
    console.log(formData);
    var productName = this.dataSource.find(
      (e: { id: number }) => e.id === formData.product.id
    );
    console.log(productName);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      // save the data from the form
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(
        GlobalConstants.productAdded,
        'success'
      );
    } else {
      this.snackbarService.openSnackBar(
        GlobalConstants.productExists,
        GlobalConstants.error
      );
    }
  }

  handleDeleteAction(values: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(values, 1); // remove the bill at tthe specified index
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    var formData = this.manageOrderForm.value;
    // save the data into a JSON format
    var data = {
      name: formData.name,
      tableNumber: formData.tableNumber,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      paymentStatus: 'completed',
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource),
    };
    this.ngxService.start();
console.log(formData.paymentMethod );

    if (formData.paymentMethod === 'Cash') {
      this.billService.generateReport(data).subscribe(
        (response: any) => {
          // this.downloadFile(response?.uuid); // download the file.
          this.manageOrderForm.reset();
          this.dataSource = [];
          this.totalAmount = 0;
          this.snackbarService.openSnackBar(
            GlobalConstants.order,
            'success'
          );
          this.ngxService.stop();
        },
        (error: any) => {
          console.log(error);
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
    }else  {
    this.billService
      .createTransaction(this.totalAmount)
      .subscribe((tnx: any) => {
        console.log(tnx);

        const options = {
          key: this.RAZOR_KEY,
          amount: tnx.amount,
          description: 'Great offers',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSauVTVO0G3owQruYyJ9ssThsAi0HCcs2gPR3C3LCp1ypJhAwkPuI-WjKxfQSo8fTh-aU&usqp=CAU',
          order_id: tnx.orderId, //Order ID generated in Step 1
          currency: tnx.currency,
          name: formData.name,
          prefill: {
            email: 'namastevillage@gmail.com',
            // contact: formData.contactNumber,
            contact: '9191919191'

          },
          theme: {
            color: '#000000',
          },
        };
        Checkout.open(options)
          .then((response) => {
            console.log(response);

            // pass the format to the backend
            this.billService.generateReport(data).subscribe(
              (response: any) => {
                // this.downloadFile(response?.uuid); // download the file
                this.manageOrderForm.reset();
                this.dataSource = [];
                this.totalAmount = 0;
                this.snackbarService.openSnackBar(
                  GlobalConstants.order,
                  'success'
                );
                this.ngxService.stop();
              },
              (error: any) => {
                console.log(error);
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
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }

  }

  // downloadFile(fileName: string) {
  //   var data = {
  //     uuid: fileName,
  //   };
  //   // get the pdf via the uuid
  //   this.billService.getPdf(data).subscribe((response: any) => {
  //     saveAs(response, fileName + '.pdf'); // saveAs() saves to the computer
  //     this.ngxService.stop();
  //   });
  // }
}
