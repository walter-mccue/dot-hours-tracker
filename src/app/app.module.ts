
// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Base Layout Path
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
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
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component'; // Shared Dialog







@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AboutComponent,
    ContactComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyAccountComponent,
    ResetPasswordComponent,
    ConfirmDialogComponent,
    BaseLayoutComponent,
    AuthLayoutComponent,
    ProfileComponent,
    UsersComponent,
    UserEditComponent,
    SecurityQuestionsComponent,
    SecurityQuestionEditComponent,
    RolesComponent,
    RoleEditComponent,
    NotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
