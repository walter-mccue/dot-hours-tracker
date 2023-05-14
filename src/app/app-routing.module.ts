
// Import statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

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

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [

      // Main Children
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },

      // User Children
      {
        path: 'user-list',
        component: UsersComponent,
      },
      {
        path: 'users/:userId',
        component: UserEditComponent
      },

      // Security Children
      {
        path: 'security-questions',
        component: SecurityQuestionsComponent,
      },
      {
        path: 'security-questions/:questionId',
        component: SecurityQuestionEditComponent,
      },

      // Roles Children
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'roles/:roleId',
        component: RoleEditComponent,
      },

      // User Profile Child
      {
        path: 'profile',
        component: ProfileComponent
      },
    ],
    //canActivate: [AuthGuard],
  },

  // Session Path
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [

      // Login
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },

      // Register
      {
        path: 'register',
        component: RegisterComponent
      },

      // Forgot Password
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'verify-security-questions',
        component: VerifyAccountComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },

      // Error Components
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '500',
        component: ServerErrorComponent,
      },
    ],
  },
  // Unexpected URL values will redirect users to the 404 error page
  {
    path: '**',
    redirectTo: 'session/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: false,
    scrollPositionRestoration: 'enabled',
    //relativeLinkResolution: 'legacy',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
