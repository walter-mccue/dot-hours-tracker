/**
 * Title: app.module.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Main module for angular application
*/

// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Base Layout Path
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { UserEditComponent } from './pages/admin/user-edit/user-edit.component';
import { SecurityQuestionsComponent } from './pages/admin/security-questions/security-questions.component';
import { SecurityQuestionEditComponent } from './pages/admin/security-question-edit/security-question-edit.component';
import { RolesComponent } from './pages/admin/roles/roles.component';
import { RoleEditComponent } from './pages/admin/role-edit/role-edit.component';

// Auth Layout Path
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './shared/account/register/register.component';
import { ForgotPasswordComponent } from './shared/account/forgot-password/forgot-password.component';
import { VerifyAccountComponent } from './shared/account/verify-account/verify-account.component';
import { ResetPasswordComponent } from './shared/account/reset-password/reset-password.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ServerErrorComponent } from './pages/errors/server-error/server-error.component';

// Shared
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TermsOfServiceComponent } from './shared/account/terms-of-service/terms-of-service.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ErrorInterceptor } from './pages/errors/error.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

// Angular Materials
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

// PrimeNg
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    BaseLayoutComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ProfileComponent,
    UsersComponent,
    UserEditComponent,
    SecurityQuestionsComponent,
    SecurityQuestionEditComponent,
    RolesComponent,
    RoleEditComponent,
    AuthLayoutComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyAccountComponent,
    ResetPasswordComponent,
    LoginComponent,
    TermsOfServiceComponent,
    NotFoundComponent,
    ServerErrorComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MessagesModule,
    MessageModule,
    MatTableModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    MatSelectModule,
    MatStepperModule,
    MatListModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService, ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
