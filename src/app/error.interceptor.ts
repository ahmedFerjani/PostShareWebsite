import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = "An unknown reason!";
        if (err.error.message) {
          errorMessage = err.error.message;
        }
        //console.log(err);
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        //alert(err.error.message);
        return throwError(err);
      })
    );
  }
}
