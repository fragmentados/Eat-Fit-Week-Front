import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationStateService {

  private isMobileResolution: boolean;
  private isTabletResolution: boolean;

  constructor() {
    this.isMobileResolution = (window.innerWidth < 768);
    this.isTabletResolution = !this.isMobileResolution && (window.innerWidth < 1000);
  }

  public getIsMobileResolution(): boolean {
    return this.isMobileResolution;
  }

  public getIsTabletResolution(): boolean {
    return this.isTabletResolution;
  }
}
