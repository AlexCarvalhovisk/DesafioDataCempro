import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    RouterModule
  ]
})
export class AppComponent {
  title = 'angular-product-app';
}
