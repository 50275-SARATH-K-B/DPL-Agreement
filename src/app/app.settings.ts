
import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'PERSONAL LOAN',   //theme name
        true,       //loadingSpinner
        true,       //fixedHeader
        true,       //sidenavIsOpened
        false,       //sidenavIsPinned  
        false,       //sidenavUserBlock 
        'vertical', //horizontal , vertical
        'default',  //default, compact, mini
        'teal-light',   //indigo-light, teal-light, red-light, blue-dark, green-dark, pink-dark
        false ,      // true = rtl, false = ltr
        false   //ajax false
    )
}
import { NativeDateAdapter } from '@angular/material';
const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

export class DateFormat extends NativeDateAdapter {
  useUtcForDisplay = true;
  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}





