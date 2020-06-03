import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-main-toolbar [appName]="title"></app-main-toolbar>
    <router-outlet></router-outlet>
    <app-main-footer><app-main-footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'Mercadinho da Esquina';
}
