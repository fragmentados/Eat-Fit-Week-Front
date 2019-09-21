import { UpdateIngredientComponent } from './update-ingredient/update-ingredient.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngredientComponent } from './ingredient/ingredient.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';

const routes: Routes = [
  {
    path: '',
    component: IngredientComponent
  },
  {
    path: 'addIngredient',
    component: AddIngredientComponent
  },
  {
    path: 'updateIngredient/:id',
    component: UpdateIngredientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientRoutingModule {}
