import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-toolbar',
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z5">
      <app-main-menu></app-main-menu>
      {{ appName }}
    </mat-toolbar>
  `,
  styles: [
  ]
})
export class MainToolbarComponent implements OnInit {
  @Input() appName : string
  
  constructor() { }

  ngOnInit(): void {
  }

}
