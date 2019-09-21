import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from '../../models/service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent {

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  @Input() view: string;

  @Input() viewDate: Date;

  @Input() locale: string;

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
}
