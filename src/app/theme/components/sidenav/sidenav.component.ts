import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../pages/login/authentication.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class SidenavComponent implements OnInit {
  @Input() item = ''; 
  public userImage = 'assets/img/users/user.jpg';
  public menuItems: Array<any>;
  public settings: Settings;
  buildVersion: any = environment.buildVersion;
  datakey: any;
  constructor(public appSettings: AppSettings, public menuService: MenuService,private authenticationService: AuthenticationService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
 
    
      this.menuItems = this.menuService.getVerticalMenuItems();

    
    // this.settings.sidenavIsPinned = false;
  }

  public closeSubMenus() {
    let menu = document.querySelector(".sidenav-menu-outer");
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

}
