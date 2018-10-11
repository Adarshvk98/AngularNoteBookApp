import { Component, OnInit,OnDestroy } from '@angular/core';
import{FormBuilder ,Validators,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {AuthenticationService} from '../../providers/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../view.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form_group:FormGroup;
  private subscriptions:Subscription[]=[];
  constructor(
    private _fb: FormBuilder,
    private auth:AuthenticationService,
    private router: Router,
    private alert: ToastrService
    ) { this.createForm()}

  ngOnInit() {
  }
  private createForm(): void {
    this.form_group = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  public submit(): void {
    // auth services
    //loading
    this.auth.isLoading.next(true);
    if (this.form_group.valid) {
      const { email, password } = this.form_group.value;
      this.subscriptions.push(
        this.auth.login(email, password).subscribe(success => {
          if (success) {
            this.router.navigateByUrl('/dashboard');
          } else{
          //alert
         this.alert.error('Username or password is wrong','Login Failed');
          }
         //loading
         this.auth.isLoading.next(false);
        })
      );
    } else {   
      setTimeout(() => {
        //loading
        this.auth.isLoading.next(false);
      }, 2000);

    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
