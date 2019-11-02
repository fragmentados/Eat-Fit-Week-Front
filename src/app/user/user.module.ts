import { IngredientService } from './../ingredient/ingredient.service';
import { UserService } from './../user.service';
import { UserRoutingModule } from './user-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserConfsComponent } from './user-confs/user-confs.component';
import { LoginComponent } from './login/login.component';
import { FacebookService } from 'ngx-facebook';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  declarations: [UserComponent, AddUserComponent, UserConfsComponent, LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
    UserRoutingModule
  ],
  exports: [UserComponent, AddUserComponent],
  providers: [IngredientService, FacebookService]
})
export class UserModule { }
