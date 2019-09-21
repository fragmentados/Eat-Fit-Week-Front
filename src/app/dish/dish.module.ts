import { NutritionModule } from './../nutrition/nutrition.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDishComponent } from './add-dish/add-dish.component';
import { DishesComponent } from './dishes/dishes.component';
import { FormsModule } from '@angular/forms';
import { DishRoutingModule } from './dish-routing.module';
import { DishRestService } from './dishRest.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { UpdateDishComponent } from './update-dish/update-dish.component';
import { MenuModule } from '../menu/menu.module';
import { DishService } from './dish.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [AddDishComponent, DishesComponent, UpdateDishComponent],
  imports: [
    CommonModule,
    FormsModule,
    DishRoutingModule,
    NutritionModule,
    MenuModule,
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
  exports: [DishesComponent],
  providers: [DishRestService, DishService, IngredientService]
})
export class DishModule { }
