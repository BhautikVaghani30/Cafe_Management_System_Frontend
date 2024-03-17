import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataService } from '../services/data.service';
import { MaterialModule } from '../shared/material-module';
import { CategoryComponent } from './dialog/category/category.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { ProductComponent } from './dialog/product/product.component';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { MaterialRoutes } from './material.routing';
import { ShowOrdersComponent } from './show-orders/show-orders.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
  ],
  providers: [DataService],
  declarations: [
    ViewBillProductsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageCategoryComponent,
    CategoryComponent,
    ManageProductComponent,
    ProductComponent,
    ManageOrderComponent,
    ViewBillComponent,
    ShowOrdersComponent,
    ManageUserComponent,
  ],
})
export class MaterialComponentsModule {}
