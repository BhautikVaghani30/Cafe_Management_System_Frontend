import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar:MatSnackBar) { }

  // opens either a red or green toast depending on whether the request was successful or not
  openSnackBar(message:string, action:string) {
    if (action === "error") {
      this.snackBar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 2300,
        panelClass: ['red-snackbar']
      });
    }
    else {
      this.snackBar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 2300,
        panelClass: ['green-snackbar']
      });
    }
  }
}
