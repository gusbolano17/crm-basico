import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private readonly snackBar = inject(MatSnackBar);

  open(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  alertDelete(message: string, action: string = 'Cerrar') {
    return this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['snackbar-delete']
    });
  }
}
