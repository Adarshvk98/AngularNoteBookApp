import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject, ReplaySubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from '../../../node_modules/rxjs/operators';
import { from,of} from 'rxjs';
import{User} from '../providers/user';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public isLoading:BehaviorSubject<boolean>=new BehaviorSubject(false);
  public currentUser: Observable<User | null>;
  public currentuserSnapshort: User | null;
  public notelist:Observable<any>; 
  constructor(
    private fire_auth: AngularFireAuth,
    private fire_db: AngularFirestore,
    private router:Router,
    private alert:ToastrService
    ) { 
      this.currentUser = this.fire_auth.authState.pipe(switchMap((user) => {
        if (user) {
          return this.fire_db.doc<User>(`Users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));
      this.notelist = this.fire_auth.authState.pipe(switchMap((user)=>{
       if(user){
         return this.fire_db.collection(`NoteBook/${user.uid}/notes`).valueChanges();
       }else{
         return null;
       }
     }))
      this.setCurrentuserSnapshort();
    }


    public signUp(first_name: string, last_name: string, email: string, password: string): Observable<boolean> {
      // firebase signup
      return from(
        this.fire_auth.auth.createUserWithEmailAndPassword(email, password)
          .then((credential) => {
            const userRef: AngularFirestoreDocument<User> = this.fire_db.doc(`Users/${credential.user.uid}`);
            const updatedUser = {
              id: credential.user.uid,
              email: credential.user.email,
              first_name,
              last_name
            };
            userRef.set(updatedUser);
            return true;
          })
          .catch((err) => false)
      );
    }

  public login(email: string, password: string): Observable<boolean> {
    // firebase login
    return from(
      this.fire_auth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => true)
        .catch((err) => false)
    );
  }

  public logout(): void {
    // firebase logout
    this.fire_auth.auth.signOut().then(() => {
      this.alert.success('succesfully logout', 'Success');
      this.router.navigate(['/login']); 
    });

  }

  private setCurrentuserSnapshort(): void {
    this.currentUser.subscribe(user => {
      this.currentuserSnapshort = user;
    });
  }

  //add new note 

   public addNote(userId,title,condent): Observable<boolean>{
    return from(
      this.fire_db.collection(`NoteBook/${userId}/notes`).
        add({title,content:condent}).then(docRef =>{
          this.fire_db.doc(`NoteBook/${userId}/notes/${docRef.id}`).update({id:docRef.id});
          return true;
        }).catch(err => {return false})
    )
  } 
    
public deleteNote(noteId,userId){
  return from(
    this.fire_db.firestore.doc(`NoteBook/${userId}/notes/${noteId}`).delete().then(()=>{
      return true;
    }).catch((err)=>{return false}) 
  ); 
 }
 public updateNote(note_id,user_id,title,content){
   return from(
     this.fire_db.doc(`NoteBook/${user_id}/notes/${note_id}`).update({title,content}).then(()=>{
       return true;
     }).catch((err)=>{return false})
   );
 }
}
