import { ApplicationStateService } from './application-state.service';
import { CalendarCommonModule, DateAdapter } from './calendar/common/calendar-common.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { CalendarModule } from './calendar/calendar.module';
import { adapterFactory } from './calendar/date-adapters/date-fns';
import { UserService } from './user.service';
import { FacebookModule } from 'ngx-facebook';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppHeaderComponent } from './app-header/app-header.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent
  ],
  imports: [
    FacebookModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    CalendarCommonModule,
    HttpClientModule,
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [UserService, ApplicationStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
