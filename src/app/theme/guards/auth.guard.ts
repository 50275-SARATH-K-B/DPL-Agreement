import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorisationService } from '../../theme/services/authorisation.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../theme/services/alert.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../services/report/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  currentUrl: string;
  constructor(private commonService: CommonService,private route: ActivatedRoute,private dialog:MatDialog,private dialogRef: MatDialogRef<LoanSearchComponent>,private idle: Idle, private keepalive: Keepalive,private router: Router
    , private authservice: AuthorisationService
    , private alertService: AlertService) {
  
      idle.setIdle(420); // this will be 58*60

      idle.setTimeout(5); //counter time.
  
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // there are various Interupts
  
      idle.onIdleEnd.subscribe(() => {
  
        this.idleState = 'No Longer Idle';
        console.log(this.idleState)
  
      });// this is the palce to do somthing if user comes back after being idle.
  
      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        console.log(this.idleState)
  
        this.timedOut =true;
        this.dialog.closeAll()

        this.router.navigate(['/time-out']);
        this.reset()
  
      });// this is place for redirect to login page.
  
      idle.onIdleStart.subscribe(() =>{
  
        this.idleState = 'You have gone Idle';
        console.log(this.idleState)
  
      }); // this is place to do somthing when user goes Idle.
  
      idle.onTimeoutWarning.subscribe((countdown) => {
  
        this.idleState = 'You will time out in ' + countdown + 'seconds';
        console.log(this.idleState)
      }); // this is the place for alert to notify of the logout 
  
      keepalive.interval(5);
      
      keepalive.onPing.subscribe(() => {
        this.commonService.session2()

        this.lastPing = new Date();
        console.log(this.lastPing)
  
      });
      this.reset(); // this function start the whole ng Idle
     }
     reset() {
      this.idle.watch();
      this.idleState = 'Started.';
      this.timedOut = false;
    }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (sessionStorage.getItem('currentUser')) {
        return true;
    }else if(sessionStorage.getItem('branchuser')){
      return true;
    }
          // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']/* , { queryParams: { returnUrl: state.url }} */);
    return false;
  }
}
