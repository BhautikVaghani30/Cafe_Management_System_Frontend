import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<LoginComponent>,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[null, [Validators.required, Validators.pattern(GlobalConstants.emailegex)]],
      password:[null, [Validators.required]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    // send values from form to backend
    this.userService.login(data).subscribe((response:any)=> {
      this.ngxService.stop();
      this.dialogRef.close();
      // save the JWT token to local storage
      localStorage.setItem('token', response.token);
      // if login is successful, route to the dashboard
      this.router.navigate(['/cafe/dashboard']);
    }, (error)=> {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
