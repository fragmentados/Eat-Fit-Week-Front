import { UpdateDishComponent } from './update-dish/update-dish.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DishesComponent } from './dishes/dishes.component';
import { AddDishComponent } from './add-dish/add-dish.component';

const routes: Routes = [
  {
    path: '',
    component: DishesComponent
  },
  {
    path: 'addDish',
    component: AddDishComponent
  },
  {
    path: 'updateDish/:id',
    component: UpdateDishComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DishRoutingModule {}
