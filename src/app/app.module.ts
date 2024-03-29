import { LOCALE_ID, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app.routing";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "./components/shared.module";
import { PagesComponent } from "./pages/pages.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JwtModule } from "@auth0/angular-jwt";
import { AppGetTokenInterceptor } from "./public/interceptors/get-token.interceptor";
import { ErrorInterceptor } from "./public/interceptors/error.interceptor";
import { AppInterceptor } from "./public/interceptors/app.interceptor";
import { CloudinaryModule } from "@cloudinary/ng";
import localeVi from "@angular/common/locales/vi";
import { registerLocaleData } from "@angular/common";

@NgModule({
  declarations: [AppComponent, PagesComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    CloudinaryModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppGetTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: "vi-VN",
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeVi);
  }
}

function tokenGetter() {
  return localStorage.getItem("JWT_TOKEN");
}
