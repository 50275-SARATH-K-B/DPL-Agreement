import { Renderer2,Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RepaymentService } from '../../services/report/repayment.service';
declare var Digio: any;
import './Digio.js';
import { CommonService } from '../../services/report/common.service';

@Component({
  selector: 'app-digioesign',
  templateUrl: './digioesign.component.html',
  styleUrls: ['./digioesign.component.scss']
})
export class DigioesignComponent implements OnInit {

  constructor( private _renderer2: Renderer2,private commonService: CommonService, 
    @Inject(DOCUMENT) private _document: Document, private elementRef: ElementRef,private httpClient: HttpClient,private repaymentService: RepaymentService) { }

  ngOnInit() {
    
    // let script = this._renderer2.createElement('script');
    //     script.type = `text/javascript`;
    //     script.src = `https://app.digio.in/sdk/v11/digio.js`;

    //     this._renderer2.appendChild(this._document.body, script);
    // }
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var c1 = 0 ;var c2 = 0;var c3 = 0; var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

      let id = 'DID231025120359861JX5AJ5NPRVMULM'
      var options = {
        environment : "production",
        callback : function (response){
        if(response.hasOwnProperty("error_code")) {
        return console.log("error occurred in process");
        }
        
        console.log("Signing completed successfully");
        },
        logo : "https://gen.mactech.net.in/PrivacyPolicy/mafillogo/manappuram.png", 
        theme : {
        primaryColor : "#AB3498",
        secondaryColor : "#000000"
        }
        }
     
        this.addJsToElement('https://app.digio.in/sdk/v11/digio.js').onload = (teste) => {
          console.log(teste)
      }
        // var digio = new Digio(options);
    
        //           digio.init();
    
    
        //           digio.submit(id,'7907714368');

        //           digio.esign(id,'7907714368')
        var d2 = Base64.encode('AIMEMSX9C3ROHTSTNJJA67M7BPM4RBJ9:4G77IBRMXDUBFOYMT3MM9UDEMBA4DTMK');

                  this.commonService.esigndownload(id,d2).subscribe(res=>{
                  })
    
                      
                       

  }
  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this._renderer2.appendChild(document.body, script);
    return script;
  }
 digiooption(){



// digio.submit(res['id'], this.searchData['mobileNo']);
    
 }
  afterScriptAdded() {
    const params= {
      width: '350px',
      height: '420px',
    };
    if (typeof (window['functionFromExternalScript']) === 'function') {
      window['functionFromExternalScript'](params);
    }
  }
}
