import { Component, OnInit,OnDestroy } from '@angular/core';
import {AuthenticationService} from '../../providers/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy{
  public user :any;
  public Note :Array<any> = [];
  title:string;
  content:string;
  title_update:string;
  content_update:string;
  private subscriptions: Subscription[] = [];
  constructor(
    private auth :AuthenticationService,
    private alert: ToastrService
    ) { }

  ngOnInit() {
    this.user = this.auth.currentuserSnapshort;
    this.cd.detectChanges();
     this.auth.notelist.subscribe((doc)=>{
      this.Note = doc;
    }); 
  }
 save(){
   if(this.title == undefined || this.content == undefined){
    this.alert.error('please enter the title and content to save the note','Condent and Title reqiured');
   }else{
     this.auth.addNote(this.user.id,this.title,this.content).subscribe(success =>{
       if(success){
         this.alert.success('Your note is succesfully saved','Success');
       }else{
        this.alert.error('Something went wrong in saving note please try again','Failed');
       }
     })
   }
 }

 delete(doc_id,userId){
  this.auth.deleteNote(doc_id,userId).subscribe((success)=>{
    if(success){
      this.alert.success('Your note is succesfully deleted','Success');
    }else{
      this.alert.error('Something went wrong in saving note please try again','Failed');
    }
  });
 }
  update(doc_id,user_id){
    if(this.title_update == undefined || this.content_update == undefined){
      this.alert.error('please enter the title and content to save the note','Condent and Title reqiured');
     }else{
       this.auth.updateNote(doc_id,user_id,this.title_update,this.content_update).subscribe((success)=>{
         if(success){
           this.alert.success('your note is updated','success');
         }else{
          this.alert.error('Something went wrong in updating note please try again','Failed');
         }
       })
     }
  }
  logout(){
    this.auth.logout();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
