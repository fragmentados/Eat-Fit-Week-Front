import { ShoppingItem } from './../../models/menu/shoppingList/shoppingItem.model';
import { DEFAULT_LANG } from './../../models/service';
import { ShoppingList } from './../../models/menu/shoppingList/shoppingList.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar-week-view-shopping-list',
  templateUrl: './calendar-week-view-shopping-list.component.html',
  styleUrls: ['./calendar-week-view-shopping-list.component.css']
})
export class CalendarWeekViewShoppingListComponent implements OnInit {

  constructor(private translate: TranslateService, public dialogRef: MatDialogRef<CalendarWeekViewShoppingListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingList) {
      this.translate.setDefaultLang(DEFAULT_LANG);
    }

  ngOnInit() {
  }

  printDialog() {
      const mywindow = window.open('', 'PRINT', 'height=400,width=600');

      const title  = this.translate.get('CALENDAR.SHOPPING_LIST').subscribe(data => {
        mywindow.document.write('<html><head><title>' + data + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>' + data + '</h1>');
        mywindow.document.write(document.getElementById('shopping-list dialog').innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();
      });


      return true;
  }

  removeRow(item: ShoppingItem) {
    this.data.items = this.data.items.filter(i => i !== item);
  }

  onOkClick(): void {
    this.dialogRef.close();
  }
}
