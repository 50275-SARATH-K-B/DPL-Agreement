import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../login/authentication.service';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {
  keydata: any;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.keydata = this.authenticationService.keydata;
    console.log(this.keydata)
  }

}
