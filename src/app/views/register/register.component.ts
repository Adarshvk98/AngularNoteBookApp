import { Component, OnInit ,OnDestroy} from '@angular/core';
import {FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../providers/authentication.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../view.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public signup_group: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private _fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private alert:ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }
  private createForm(): void {
    this.signup_group = this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public submit(): void {
    // auth services
    if (this.signup_group.valid) {
      //loading
      this.auth.isLoading.next(true);
      const { first_name, last_name, email, password } = this.signup_group.value;
      this.subscriptions.push(
        this.auth.signUp(first_name, last_name, email, password).subscribe(success => {
          if (success) {
            this.router.navigate(['/dashboard']);
          } else {
            //alert
            this.alert.warning('Please check the provided information','Something Went Wrong');
          }
         //loading
         this.auth.isLoading.next(false);
        })
      );
    } else {

    }
 }
 ngOnDestroy() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}
}
