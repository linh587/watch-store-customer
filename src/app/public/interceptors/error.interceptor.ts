import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from "@angular/common/http";
import { Observable, Subject, switchMap, tap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { StorageService } from "../../services/storage/storage.service";
import { AuthService } from "../../services/auth/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private refreshTokensSubject$ = new Subject();
  private isLoadingRefresh: boolean = false;

  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((res) => {
        const isRefreshToken = ErrorInterceptor.isRequestRefresh(request.url);

        // Nếu là response && refresh-token.
        if (isRefreshToken && res instanceof HttpResponse) {
          const authorization = this.storageService
            .get("JWT_TOKEN")
            ?.replace("Bearer", "")
            .trim();
          const refreshTk = this.storageService.get("JWT_REFRESH_TOKEN");

          this.storageService.set("JWT_REFRESH_TOKEN", refreshTk);
          this.storageService.set("JWT_TOKEN", authorization);

          this.refreshTokensSubject$.next(authorization);
        }
      }),
      // @ts-ignore
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          return this.handleError(error, request, next);
        }
        return throwError(error);
      })
    );
  }

  private handleError(
    error: any,
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    switch (error.status) {
      case HttpStatusCode.Forbidden:
        return ErrorInterceptor.onHandleError403();
      case HttpStatusCode.Unauthorized:
        return this.onHandleError401(request, next);
      default:
        return ErrorInterceptor.onHandleErrorOther(error);
    }
  }

  private static onHandleError403() {
    localStorage.clear();
    location.reload();
  }

  private onHandleError401(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.storageService.get("JWT_REFRESH_TOKEN");
    if (!refreshToken) {
      window.location.reload();
      this.storageService.deleteAll();
      return;
    }

    if (!this.isLoadingRefresh) {
      this.isLoadingRefresh = true;
      return this.authService.refreshToken({ refreshToken: refreshToken }).pipe(
        // @ts-ignore
        switchMap((res: any) => {
          this.isLoadingRefresh = false;
          const token = res.accessToken;
          const refreshToken = res.refreshToken;
          this.storageService.set("JWT_TOKEN", token);
          this.storageService.set("JWT_REFRESH_TOKEN", refreshToken);
          return next.handle(ErrorInterceptor.addTokenHeader(request, token));
        })
      );
    }

    //  If is loading get token.
    return this.refreshTokensSubject$.pipe(
      // @ts-ignore
      switchMap((token: string) =>
        next.handle(ErrorInterceptor.addTokenHeader(request, token))
      )
    );
  }

  private static onHandleErrorOther(error: any) {
    throw error;
  }

  private static addTokenHeader(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    /* for Spring Boot back-end */
    return request.clone({
      headers: request.headers.set("Authorization", token),
    });
  }

  private static isRequestRefresh(url: string) {
    if (url.includes("refresh")) {
      return "JWT_REFRESH_TOKEN";
    }
    return null;
  }
}
