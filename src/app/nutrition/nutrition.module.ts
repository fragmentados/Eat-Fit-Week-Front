import { FormsModule } from '@angular/forms';
import { ViewStatsComponent } from './view-stats-dashboard/view-stats/view-stats.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewStatsDashboardComponent } from './view-stats-dashboard/view-stats-dashboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [ViewStatsComponent, ViewStatsDashboardComponent],
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
    })
  ],
  exports: [ViewStatsDashboardComponent, ViewStatsComponent]
})
export class NutritionModule { }
