import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from '../../models/service';

@Component({
  selector: 'app-menu-save-template',
  templateUrl: './menu-save-template.component.html',
  styleUrls: ['./menu-save-template.component.css']
})
export class MenuSaveTemplateComponent implements OnInit {

  templateName: string;

  constructor(private translate: TranslateService, public dialogRef: MatDialogRef<MenuSaveTemplateComponent>) {
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  ngOnInit() {

  }

}
