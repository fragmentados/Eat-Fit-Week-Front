import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuCalendarComponent } from './menu-calendar/menu-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: MenuCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {}
