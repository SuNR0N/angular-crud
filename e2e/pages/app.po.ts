import { browser, by, element, ElementFinder } from 'protractor';

export class AngularCrudPage {
  public header: ElementFinder;

  constructor() {
    this.header = element(by.css('h1'));
  }

  navigateTo() {
    return browser.get('/');
  }
}
