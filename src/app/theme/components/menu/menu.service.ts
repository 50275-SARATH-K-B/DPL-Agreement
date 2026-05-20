import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Menu } from './menu.model';
import { horizontalMenuItems, verticalMenuItems,verticalMenuItems1 } from './menu';
import { AuthenticationService } from '../../../pages/login/authentication.service';

@Injectable()
export class MenuService {

  constructor(private location: Location, private router: Router, private authenticationService: AuthenticationService) { }

  public getVerticalMenuItems(): Array<Menu> {
    // let MENU_LIST = [];
    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // let MenuList = currentUser['rolefunctionList'];
    // for (let i = 0; i < MenuList.length; i++) {
    //   let menuItem = new Menu(MenuList[i].FunctionID, MenuList[i].FunctionName, MenuList[i].RouterLink, null, MenuList[i].Icon != null ? MenuList[i].Icon : 'error', null, +MenuList[i].HasSubMenu == 0 ? false : true,  +MenuList[i].ParentID);
    //   MENU_LIST.push(menuItem)
    //   if (i == MenuList['length'] - 1) { return MENU_LIST; }
    // }
   
    
      return verticalMenuItems;

    

  }
  public getmenu(): Array<Menu>{
    return verticalMenuItems1;
  }

  public getHorizontalMenuItems(): Array<Menu> {
    return horizontalMenuItems;
  }

  public expandActiveSubMenu(menu: Array<Menu>) {
    let url = this.location.path();
    let routerLink = url; // url.substring(1, url.length);
    let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId != 0) {
        let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId) {
    let menuItem = document.getElementById('menu-item-' + menuId);
    let subMenu = document.getElementById('sub-menu-' + menuId);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      } else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  public closeOtherSubMenus(menu: Array<Menu>, menuId) {
    let currentMenuItem = menu.filter(item => item.id == menuId)[0];
    if (currentMenuItem.parentId == 0 && !currentMenuItem.target) {
      menu.forEach(item => {
        if (item.id != menuId) {
          let subMenu = document.getElementById('sub-menu-' + item.id);
          let menuItem = document.getElementById('menu-item-' + item.id);
          if (subMenu) {
            if (subMenu.classList.contains('show')) {
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }
          }
        }
      });
    }
  }


}
