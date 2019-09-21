import { MenuDay } from './menuDay.model';
import { Stat } from '../nutrition/stat.model';

export class Menu {
  id: number;
  startDate: string;
  days: MenuDay[];
  stats: Stat[];
}
