import { DEFAULT_LANG } from './../../../models/service';
import { UserConfs } from './../../../models/user/userConfs.model';
import { Component, Input } from '@angular/core';
import { Stat } from '../../../models/nutrition/stat.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.component.html',
  styleUrls: ['./view-stats.component.css']
})
export class ViewStatsComponent {

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  @Input() statsTitle: string;

  @Input() viewageType: string;

  @Input() stats: Stat[];

  @Input() userConfs: UserConfs = new UserConfs();

  @Input() areMenuStats: boolean;

  isStatOverLimit(stat: Stat): boolean {
    let evaluation = false;
    if (stat.name === 'Calories') {
      evaluation = parseFloat(stat.value) > this.userConfs.maxCaloriesPerWeek;
    } else if (stat.name === 'Proteins') {
      evaluation = parseFloat(stat.value) > this.userConfs.maxProteinsPerWeek;
    } else if (stat.name === 'Fats') {
      evaluation = evaluation = parseFloat(stat.value) > this.userConfs.maxFatsPerWeek;
    } else {
      evaluation = evaluation = parseFloat(stat.value) > this.userConfs.maxCaloriesPerWeek;
    }
    return evaluation;
  }
}
