import { Stat } from '../nutrition/stat.model';

export class MenuDish {
  id: number;
  name: string;
  date: string;
  stats: Stat[];
}
