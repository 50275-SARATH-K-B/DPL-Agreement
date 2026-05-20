import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import {   MatDialogRef } from '@angular/material/dialog';

import 'fabric';
import { NgxImageCompressService } from 'ngx-image-compress';
declare const fabric: any;
@Component({
  selector: 'app-aadharmasking',
  templateUrl: './aadharmasking.component.html',
  styleUrls: ['./aadharmasking.component.scss']
})
export class AadharmaskingComponent implements OnInit {

  isCropper:boolean = false;
  isAaadhar:boolean = true;
  isUpload:boolean = true;
  isCamera:boolean = false;

  @ViewChild('angularCropperAadhar') public angularCropperAadhar: CropperComponent;
  imgUrl2: string;

  constructor( @Inject(MAT_DIALOG_DATA) private data: any,private dialogRef: MatDialogRef<AadharmaskingComponent>,
  private imageCompress: NgxImageCompressService){ }

  configAadhar = {
    dragMode : 'move',
    background : true,
    viewMode: 1,
    checkImageOrigin : true,
    cropmove:this.cropMovedAadhar.bind(this),
    checkCrossOrigin: true,
    movable: false,
    zoomable: false,
    rotatable: false,
    scalable: false
  };
  imageUrl:any = '';
  imgUrl:any = '';
  canvasData:any;
  cropMovedAadhar(data){
    console.log('crop moved aadhar');

    this.imgUrl = data.target.cropper.getCroppedCanvas().toDataURL('image/jpeg');

  }

  ngOnInit() {
    console.log(this.data);

    let component = this;

    this.imgUrl='data:image/png;base64,' + this.data
    component.hideAadharImageNumber();
  }

  ImageSource: any;
  imgResultBeforeCompress:any;
  imgResultAfterCompress:any;
  isHideAadharNumber:boolean = false;
  compress() {
    let component = this;
    this.imgResultBeforeCompress = this.imgUrl;
    this.imageCompress.compressFile(this.imgUrl, -2, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;

        this.ImageSource = this.imgResultAfterCompress;
        this.isCropper = false;
        this.isHideAadharNumber = true;
        component.hideAadharImageNumber();
        
      }
    );
  }
  CameraActive: any = false;

  public showWebcam = false;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {

  };
  public errors: WebcamInitError[] = [];
  public webcamImg: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  cameraOptions(): any {
    this.showWebcam = true;
    this.allowCameraSwitch = true;
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }


  public triggerSnapshot(): void {
    this.isUpload = false;
    this.isCamera = true;
    this.openDialog()
    this.trigger.next();
  }

  
  openDialog(): void {
    this.CameraActive = true;
    this.cameraOptions();
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  imageData: any =[] ;
  public handleImage(webcamImage: WebcamImage): void {
    this.imageUrl = webcamImage['_imageAsDataUrl'];
    this.isCamera = false;
    this.isUpload = false;
    this.isCropper = false;
    
  }

  realWidth:number;
  realHeight:number;
  canvas:any;
  croppedImageWidth:number = 200;
  croppedImageHeight:number = 200;
  hideAadharImageNumber(){
   
    this.croppedImageWidth = 200;
    this.croppedImageHeight = 200;
    this.canvas = new fabric.Canvas('aadharCanvas');

    this.canvas.clear();
    this.drawAadharImage();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }


  canvasWidth:number;
  canvasHeight:number;
  drawAadharImage(){
    // debugger
    let component = this;

    let ImageSource = this.imgUrl;

    let image = new Image();
    image.src = this.imgUrl;

    image.onload = function(){
      let image_width;
      let image_height;
      component.realWidth = image.width;
      component.realHeight = image.height;

      let realWidth = component.realWidth;
      let realHeight = component.realHeight;

      if(realHeight > realWidth){
        component.canvasWidth = component.croppedImageWidth;
        component.canvasHeight = (realHeight/realWidth) * component.croppedImageWidth;
        component.canvas.setDimensions({ width: component.canvasWidth, height: component.canvasHeight });
        component.croppedImageHeight = component.canvas.height;
  
        component.getMasks();
  
        image_width = component.croppedImageWidth;
        image_height = (realHeight/realWidth) * component.croppedImageWidth;
      }else{
        component.canvasHeight = component.croppedImageHeight;
        component.canvasWidth = (realWidth/realHeight) * component.croppedImageHeight;
        component.canvas.setDimensions({ width: component.canvasWidth, height: component.canvasHeight });
        component.croppedImageWidth = component.canvas.width;
  
        component.getMasks();
  
        image_width = component.croppedImageWidth;
        image_height = (realHeight/realWidth) * component.croppedImageWidth;
       

      }

      let options = {
        left:0,
        top:0,
        selectable:false
      }
      let aadhar_image = new fabric.Image(image,options);
      aadhar_image.scaleToWidth(image_width);
      aadhar_image.scaleToHeight(image_height);
      component.canvas.add(aadhar_image);
      console.log(component.canvas.add(aadhar_image));
      
    }

  }

  mask:any;
  masks:any[];

  getMasks(){
    let component = this;
    this.masks =[]
    let mask1 = {
      maskX:4,
      maskY:4,
      maskWidth:160,
      maskHeight:20
    };
    this.masks.push(mask1);
    console.log(this.masks);
    
  }

  addMask(){
    let component = this;

    this.masks.forEach(function(mask){
      let rect = new fabric.Rect({
        left: mask.maskX,
        top: mask.maskY,
        width: mask.maskWidth,
        height: mask.maskHeight,
        fill: 'green',
        angle: 0,
        padding: 10
      });
      component.canvas.add(rect);
      console.log(component.canvas);
      
    });
   
  }

  add(){

   
  }

  removeMasks(){
    this.canvas.clear();
    this.drawAadharImage();
  }

  doneAadharMask(){
    let canvas_image = this.canvas.toDataURL('png');

    console.log(this.data);
    
    
    this.dialogRef.close({ imageData: canvas_image ,sides:this.data});

  }

  close(){
    this.dialogRef.close();
  }



}
