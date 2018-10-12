import { Component } from '@angular/core';
import {AuthenticationService} from './providers/authentication.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public loading:AuthenticationService){
  }
}
