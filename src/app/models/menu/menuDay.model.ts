import { MenuDish } from './menuDish.model';
import { Stat } from '../nutrition/stat.model';

export class MenuDay {

  date: string;
  meals: MenuDish[];
  stats: Stat[];
}
