import { Component, Input, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AlertService } from '../../theme/services/alert.service';
import { AuthenticationService } from './authentication.service';
import { ElectronService } from 'ngx-electron';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { EncrDecrServiceService } from '../../services/encr-decr-service.service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/report/common.service';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { CommonalertComponent } from '../../commoncomponents/commonalert/commonalert.component';
import * as os from 'os-browserify/browser';
import { AuthGuard } from '../../theme/guards/auth.guard';
let CryptoJS = require('crypto-js');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {
  
  public form: FormGroup;
  returnUrl: string;
  ProductList: any;
  ProductID: any;
  public settings: Settings;
  dataset: any[]=[];
  user: number;
  userdata: any;
  token: any;
  responseCode: string;
  responseMsg: string;
  branchId: string;
  btndis: any = true;
  macAddresses: any[];
  // keydata: any;
  constructor(public AuthGuadrd:AuthGuard,private commonService: CommonService,private EncrDecr:EncrDecrServiceService,public appSettings: AppSettings, public fb: FormBuilder,
    public router: Router, private route: ActivatedRoute,
    private authenticationService: AuthenticationService, private electronService: ElectronService,
    private ngZone: NgZone,
    public dialog: MatDialog,
    public Activatedroute:ActivatedRoute,
    private alertService: AlertService) {
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required])],
      'product': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
    //  this.authenticationService.getProductList()
    //       .subscribe(result => {
    //         this.ProductList = result['productList'];
    //       })

    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required])],
      // 'product': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl)
    // const os = require('os');

    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      if (networkInterfaces.hasOwnProperty(interfaceName)) {
        const interfaces = networkInterfaces[interfaceName];
        interfaces.forEach((iface: any) => {
          if (!iface.internal && iface.mac !== '00:00:00:00:00:00') {
            this.macAddresses.push(iface.mac);
          }
        });
      }
    }
    console.log('MAC Addresses:', this.macAddresses);
  


    
    let params = {

    }
    // this.commonService.empsession(params).subscribe(res=>{

    // })
  }
  branchID: any;
  get f() { return this.form.controls; }

  encrypt(msg) {

    var pass = "LD@8RG#3SEZ";
    // random salt for derivation
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    // well known algorithm to generate key
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: 100
    });
    // random IV
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    // specify everything explicitly
    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    // combine everything together in base64 string
    var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
    return result;

  }
  public usercheck(): void {
    if (this.form.valid) {
      this.settings.loadingSpinner = true;
      let param = {
        "employeeId": this.f.email.value,
        "type": ''
      }

      this.authenticationService.concurrentusercheck(param).subscribe(data => {
        this.settings.loadingSpinner = false;
        if (data["concurrentCheck"] == 1) {
          const dialogRef = this.dialog.open(CommonalertComponent, {
            width: '55%',
            height: '50%',
            data: { message: "concurrent", datamsg: data["concurrentCheckmsg"] }
          });

          dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult == true) {
              this.settings.loadingSpinner = true;
              let param = {
                "employeeId": this.f.email.value,
                "type": 1
              }
              this.authenticationService.concurrentusercheck(param).subscribe(result1 => {
                this.onSubmit()
              })
            } else {

              this.authenticationService.logout1()
              this.router.navigate(['/login']);
            }
          })
        } else if (data["concurrentCheck"] == 0) {
          this.onSubmit()
        }
      }, error => {
        this.DisplayMessage("Oops Something Went Wrong", "Alert");
        this.settings.loadingSpinner = false;
      })
    }
  }
   generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

  public onSubmit(): void {

      if (this.form.valid) {
        // if(this.branchId == '') {
        //   this.branchId = document.getElementById("branch_id__").innerHTML;
        //   console.log(this.branchId);
        // }


         let d  = this.generateString(20).trim();
        let params = {
          "user_Id":this.f.email.value,
          "token":d
        }
        this.settings.loadingSpinner = true;

        this.commonService.sessionactive(params).subscribe(res=>{
          this.settings.loadingSpinner = false;

          if(res['message']=="Success"){
             if(environment.baseUrl == "https://uatvef.manappuram.com/" && this.f.email.value == '21722'){
              sessionStorage.setItem("branchuser", JSON.stringify({ "token":d,"employeeName":"Mafil User", "empCode": "21722", "branchID": 0/*+this.branchID*/, "productID": 69, "firmID": 1, }))
              this.router.navigateByUrl('/branchboard/dashboard2')
              // this.DisplayMessage("You Dont have permission to Enter","Alert");
    
            
            }else if (environment.baseUrl == "https://uatvef.manappuram.com/") {
              let params2 = {
                employeeCode:this.f.email.value
              }
              this.commonService.menu(params2).subscribe(res=>{
               // sessionStorage.setItem("currentUser", JSON.stringify({ "employeeName":res['employeeName'],"token":d, "empCode": this.f.email.value, "branchID": res['branchID']/*+this.branchID*/, "productID": 69, "firmID": 1, }))
                sessionStorage.setItem("currentUser", JSON.stringify({ "employeeName":"Mafil User","token":d, "empCode": this.f.email.value, "branchID": res['branchID']/*+this.branchID*/, "productID": 69, "firmID": 1, }))

                // if (this.electronService.isElectronApp) {
              
                this.router.navigate(['/personal-report/dashboard1']);
              })
             

              // }
           
              console.log(this.userdata)
            }
              else{
            //   this.router.navigate(['/personal-report/dashboard1']);
            //   localStorage.setItem("currentUser", JSON.stringify({ "employeeName":"Akhil", "empCode": "21722", "branchID": 3037/*+this.branchID*/, "productID": 69, "firmID": 1, }))
            //   console.log(this.userdata)
            // } else {
              this.alertService.error(this.branchResponse);
      
              this.settings.loadingSpinner = true;
              if (this.branchID == undefined) {
                this.getUserBranch('L');
                return;
              }
             
              // var password = this.EncrDecr.set('7x!A%D*G-KaPdSgV', this.f.password.value);
              var password = this.encrypt(this.f.password.value)
              console.log(password)
                    let param = {
                      employeeID: this.f.email.value,
                      // password: '6E45036A254F51A0C32941BB4391F554',
                      password: this.f.password.value,
                      formMode: 1,
                      branchID: +this.branchID,
                      siganture: '115.249.38.210',
                      ProductID: 43
                    }
                    this.authenticationService.login(param)
                    .pipe(first())
                    .subscribe(data => {
                      console.log(data)
                      if (data['token']) {
                        this.userdata = data
    
                        //branch
                        this.permissionbranch(d)
    
                        //Head Office
                        // this.permissionmafil(d)
    
                      } else {
                        this.DisplayMessage("You Dont have permission to Enter","Alert");
                        this.settings.loadingSpinner = false;
                      }
                    }, error => {
                      this.DisplayMessage("You Dont have permission to Enter","Alert");
                      this.settings.loadingSpinner = false;
                    });
                        
                    
      
      
          }
        }
          else{
            const dialogRef = this.dialog.open(CommonalertComponent, {
              width: '30%',
              height: '30%',
              data: { message: "concurrent", datamsg: "Session already active, do you want to continue ?" }
            });
  
            dialogRef.afterClosed().subscribe(dialogResult => {
              if (dialogResult == true) {
                let params = {
                  "user_Id":this.f.email.value
                }
                this.settings.loadingSpinner = true;
            
                this.commonService.sessionlogout(params).subscribe(res=>{
            
                  if(res['message'] = "User logged out"){
                    this.settings.loadingSpinner = false;
            
                    this.onSubmit()            
                  }else{
                    this.settings.loadingSpinner = false;

                    // this.DisplayMessage(res['status'].message, "Alert");
            
                  }
                })
              }
            })
        

          }
      
        })
 
    // }
  }
  }
  permissionbranch(d){
    let postData = {
      EmployeeID: this.f.email.value,
      Password: this.f.password.value,
      ProductID: 43,
      BranchID: this.branchID,
      BranchName: "",
      Signature: '115.249.38.210',
      FormMode: 1,
      isGoldEmployee: false
    }
    
      this.authenticationService.getFunctionList(postData)
      .pipe(first())
      .subscribe(data => {
       this.dataset = data['rolefunctionList']
       
       if(this.dataset.length == 0){``
        //for branch/head office uncomment below
        if(this.branchID == 0){
          this.DisplayMessage("You Dont have permission to Enter","Alert");
          this.settings.loadingSpinner = false;
        }else{
          this.userdata['productID']=69 
          this.userdata['token']=d
          sessionStorage.setItem('branchuser', JSON.stringify(this.userdata));
          // if (this.electronService.isElectronApp) {
          this.router.navigateByUrl('/branchboard/dashboard2') 
          // }
          this.settings.loadingSpinner = false;
        }
    
       }else{
  
      this.DisplayMessage("You Dont have permission to Enter","Alert");
      this.settings.loadingSpinner = false;

       }



      })
  }
  permissionmafil(d){
    let postData = {
      EmployeeID: this.f.email.value,
      Password: this.f.password.value,
      ProductID: 43,
      BranchID: this.branchID,
      BranchName: "",
      Signature: '115.249.38.210',
      FormMode: 1,
      isGoldEmployee: false
    }
    
      this.authenticationService.getFunctionList(postData)
      .pipe(first())
      .subscribe(data => {
       this.dataset = data['rolefunctionList']
       if(this.dataset.length == 0){
        //for branch/head office uncomment below

        // this.userdata['productID']=69 
        //  localStorage.setItem('branchuser', JSON.stringify(this.userdata));
        //  this.router.navigateByUrl('/branchboard/dashboard2')

        this.DisplayMessage("You Dont have permission to Enter","Alert");

        this.settings.loadingSpinner = false;
       }else{
        this.userdata['productID']=69 
        this.userdata['token']=d

        sessionStorage.setItem('currentUser', JSON.stringify(this.userdata));

        // if (this.electronS`  1ervice.isElectronApp) {
          this.router.navigateByUrl('/personal-report/dashboard1')
        // }
       this.settings.loadingSpinner = false;

       }



      })
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
     public AonSubmit(): void {
        if (this.form.valid) {
          this.settings.loadingSpinner = true;
          if (this.branchID == undefined) {
            this.getUserBranch('L');
            return;
          }
          this.authenticationService.login({ email: this.f.email.value, password: this.f.password.value, branchID: this.branchID })
            .pipe(first())
            .subscribe(data => {
              if (data.loginStatus === 1) {
                this.router.navigate(['/dashboard/dashboard']);
              } else {
                this.settings.loadingSpinner = false;
                this.alertService.error(data.status.message);
              }
            }, error => {
              this.alertService.error(error);
              this.settings.loadingSpinner = false;
            });
        }
      }
    branchResponse: any;
    isGoldEmployee = false;

    public onEmpChange() {
      

      if (this.electronService.isElectronApp) {
        this.requestbranchId();
        this.electronService.ipcRenderer.on('branchId-Reply', (event, host) => {
          this.ngZone.run(() => {
            this.settings.loadingSpinner = true;
            let hostNamRreply = `${host}`;
    
            this.responseCode = hostNamRreply.split('#')[0];
            this.responseMsg = hostNamRreply.split('#')[1];
            this.branchId = hostNamRreply.split('#')[2];
            sessionStorage.setItem('HOST_NAME', hostNamRreply.split('#')[3]);
            sessionStorage.setItem('MAC_ADDRESS', hostNamRreply.split('#')[4]);
            let params = {
              "user_Id": this.f.email.value,
              "mac_id": hostNamRreply.split('#')[4],
              "host_name": hostNamRreply.split('#')[3]
            
            }
            this.commonService.empsession(params).subscribe(res=>{
             
            })
            this.btndis = false;
            if (this.responseCode === "0") {
    
              this.responseCode = "0";
              const dialogRef = this.dialog.open(AlertMessageComponenent, {
                data: { message: this.responseMsg }
    
              });
              dialogRef.afterClosed().subscribe(result => {
                this.requestWindowclose();
              });
    
            } else {
    
    
            }
            this.settings.loadingSpinner = false;
          });
        });
      }
      else {
        if (this.branchId == '') {
          this.branchId = document.getElementById("branch_id__").innerHTML;
          //console.log(this.branchId);
        }
        this.getbranchid('L');
      }
    };


    getUserBranch(flag) {
      if (this.electronService.isElectronApp) {
        // this.Submitshow=false;
        this.requestbranchId();
        this.electronService.ipcRenderer.on('branchId-Reply', (event, host) => {
          this.ngZone.run(() => {
            let hostNamRreply = `${host}`;
            this.branchID = hostNamRreply.split('#')[2];
            if (hostNamRreply.split('#')[0] === "0") {
              this.branchID = undefined;
              // this.Submitshow = true;
              this.branchResponse = hostNamRreply.split('#')[1];
              const dialogRef = this.dialog.open(AlertMessageComponenent, {
                data: { message: this.branchResponse, type: 'Alert' }
              });
              dialogRef.afterClosed().subscribe(result => {
                this.requestWindowclose();
              });
              // this.btndis = false;
              // if (this.responseCode === "0") {
              // }
            }
          })
        })
      } else {
        
        this.isGoldEmployee =false;
        this.settings.loadingSpinner = true;
        this.authenticationService.getBranchID({ employeeID: +this.f.email.value })
          .subscribe(data => {
            this.settings.loadingSpinner = false;
            if (data['status'].flag == 1 && data['status'].code == 1) {
              this.branchID = data['employeeList'][0]['branchID'];
              this.btndis = false;

              this.isGoldEmployee = true;
              if (flag == 'L') {
                this.onSubmit()
              }
            } else {
              this.isGoldEmployee = false;
              this.DisplayMessage("Please check your User ID","Alert");
              this.settings.loadingSpinner = false;

            }
          }, error => { this.settings.loadingSpinner = false; })
      }
    }
    getbranchid(flag){
      this.isGoldEmployee =false;
      this.settings.loadingSpinner = true;
      this.authenticationService.getBranchID({ employeeID: +this.f.email.value })
        .subscribe(data => {
          this.settings.loadingSpinner = false;
          if (data['status'].flag == 1 && data['status'].code == 1) {
            this.branchID = data['employeeList'][0]['branchID'];
            this.btndis = false;

            this.isGoldEmployee = true;
            // if (flag == 'L') {
            //   this.onSubmit()
            // }
          } else {
            this.isGoldEmployee = false;
            this.DisplayMessage("Please check your User ID","Alert");
            this.settings.loadingSpinner = false;

          }
        }, error => { this.settings.loadingSpinner = false; })
    }
    

    requestbranchId() {
      this.electronService.ipcRenderer.send('branchId-Request', 'pingbranchId');
    }

    requestWindowclose() {
      this.electronService.ipcRenderer.send('Windowclose-Request', 'pingWindowclose');
    }
    ngAfterViewInit() {
      this.settings.loadingSpinner = false;
    }

  allowOnlyNumbers(event: KeyboardEvent) {
    const pattern = /^[0-9]*$/;

    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
 

  }