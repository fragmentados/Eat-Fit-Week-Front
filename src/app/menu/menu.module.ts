import { MenuTemplateService } from './menuTemplate.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCalendarComponent } from './menu-calendar/menu-calendar.component';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule } from '@angular/forms';
import { MenuService } from './menu.service';
import { CalendarModule } from '../calendar/calendar.module';
import { DateAdapter } from '../calendar/date-adapters/date-adapter';
import { adapterFactory } from '../calendar/date-adapters/date-fns';
import { MatDialogModule } from '@angular/material/dialog';
import { NutritionModule } from '../nutrition/nutrition.module';
import { UserService } from '../user.service';
import { MenuSaveTemplateComponent } from './menu-save-template/menu-save-template.component';
import { MenuSelectTemplateComponent } from './menu-select-template/menu-select-template.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeEs from '@angular/common/locales/es';
import localeGl from '@angular/common/locales/gl';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs);
registerLocaleData(localeGl);

@NgModule({
  declarations: [MenuCalendarComponent, MenuSaveTemplateComponent, MenuSelectTemplateComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatDialogModule,
    MenuRoutingModule,
    NutritionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    })
  ],
  entryComponents: [
    MenuSaveTemplateComponent,
    MenuSelectTemplateComponent
  ],
  providers: [MenuService, MenuTemplateService]
})
export class MenuModule { }
