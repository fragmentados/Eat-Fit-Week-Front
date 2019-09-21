import { DishRestService } from '../dish/dishRest.service';
import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CalendarWeekViewEventComponent } from './calendar-week-view-event/calendar-week-view-event.component';
import { CalendarWeekViewHeaderComponent } from './calendar-week-view-header/calendar-week-view-header.component';
import { CalendarWeekViewHourSegmentComponent } from './calendar-week-view-hour-segment/calendar-week-view-hour-segment.component';
import { CalendarWeekViewComponent } from './calendar-week-view/calendar-week-view.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CommonModule } from '@angular/common';
import { CalendarCommonModule, CalendarModuleConfig, CalendarEventTitleFormatter,
  CalendarDateFormatter, CalendarUtils } from './common/calendar-common.module';
import { CalendarWeekViewShoppingListComponent } from './calendar-week-view-shopping-list/calendar-week-view-shopping-list.component';
import { CalendarWeekViewAddDishComponent } from './calendar-week-view-add-dish/calendar-week-view-add-dish.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [CalendarWeekViewEventComponent,
    CalendarWeekViewHeaderComponent,
    CalendarWeekViewHourSegmentComponent,
    CalendarWeekViewComponent,
    CalendarWeekViewShoppingListComponent,
    CalendarWeekViewAddDishComponent,
    CalendarHeaderComponent],
  imports: [
    CommonModule,
    ResizableModule,
    DragAndDropModule,
    CalendarCommonModule,
    FormsModule,
    MatDialogModule,
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
  exports : [
    ResizableModule,
    DragAndDropModule,
    CalendarCommonModule,
    CalendarWeekViewComponent,
    CalendarWeekViewHeaderComponent,
    CalendarWeekViewEventComponent,
    CalendarWeekViewHourSegmentComponent,
    CalendarWeekViewShoppingListComponent,
    CalendarHeaderComponent
  ],
  entryComponents : [
    CalendarWeekViewShoppingListComponent,
    CalendarWeekViewAddDishComponent
  ]
})
export class CalendarModule {
  static forRoot(
    dateAdapter: Provider,
    config: CalendarModuleConfig = {}
  ): ModuleWithProviders {
    return {
      ngModule: CalendarModule,
      providers: [
        dateAdapter,
        config.eventTitleFormatter || CalendarEventTitleFormatter,
        config.dateFormatter || CalendarDateFormatter,
        config.utils || CalendarUtils,
        DishRestService
      ]
    };
  }
}
