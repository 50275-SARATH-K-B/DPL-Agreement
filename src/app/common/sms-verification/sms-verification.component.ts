import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sms-verification',
  templateUrl: './sms-verification.component.html',
  styleUrls: ['./sms-verification.component.scss']
})
export class SMSVerificationComponent implements OnInit {
  public userData: object;
  constructor(private commonService: CommonService, private dialog: MatDialog) { }

  ngOnInit() {

  }
  _sendSMS(Id,eventID, NotificationType) {
    this.userData = this.commonService.getCredentials();
    let smsData = {
      FirmID: +this.userData['firmID'],
      EventID: eventID,
      EnteredBy: this.userData['empCode'],
      productID: +this.userData['productID'],
      NotificationType: NotificationType,
      Id: Id
    }
    this.commonService.sendSMS(smsData)
      .subscribe(result => {
        if (result['status'].code == 1 && result['status'].flag == 1) {
          if (NotificationType == 1) {
            this._sendSMS(Id,eventID, 2);
          } else if (NotificationType == 2) {
            return true
          }
        } else {
          let msgType = NotificationType == 1 ? "SMS" : "Mail";
          this.DisplayMessage(msgType + ' send failed', "Alert");
        }
      })
  }


  sendSMS(params) {
    // this.userData = this.commonService.getCredentials();
    // let smsData = {
    //   FirmID: +this.userData['firmID'],
    //   EventID: params['eventID'],
    //   EnteredBy: this.userData['empCode'],
    //   productID: +this.userData['productID'],
    //   NotificationType: params['notificationType'],
    //   Id: params['ID'].toString()
    // }
    // this.commonService.sendSMS(smsData)
    //   .subscribe(result => {
    //     if (result['status'].code == 1 && result['status'].flag == 1) {
    //       if (NotificationType == 1) {
    //         this.sendSMS(eventID, 2);
    //       } else if (NotificationType == 2) {
    //         return true
    //       }
    //     } else {
    //       let msgType = NotificationType == 1 ? "SMS" : "Mail";
    //       this.DisplayMessage(msgType + ' send failed', "Alert");
    //     }
    //   })
  }

  DisplayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
