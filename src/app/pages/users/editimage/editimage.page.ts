import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common'
import * as htmlToImage from 'html-to-image';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'
import { AlertService } from 'src/app/services/alert.service';
import { TokenStorageService } from 'src/app/services/tokenstorage.service';

@Component({
  selector: 'app-editimage',
  templateUrl: './editimage.page.html',
  styleUrls: ['./editimage.page.scss'],
})
export class EditimagePage implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild("uploader", {static: true}) uploader: ElementRef<HTMLInputElement>;

  image_url: any;
  logo;
  user_id: Number;
  business_id: Number;
  edited_image_url: any;
  templates: [];
  businessName = "Company";
  contactNo = 1234567890;

  constructor(
    private location:Location,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private tokenStorage: TokenStorageService
  ){ }

  ngOnInit() {
    this.getImage();
    this.getUser();
    this.getBusinessDetails();
  }

  getBusinessDetails() {
    this.userService.getBusinessDetails(this.user_id).subscribe(
      data=> {
        if(data['businessName'] !== null) {
          this.businessName= data['businessName'];
        }
        if(!data['contactNo'] !== null) {
          this.contactNo= data['contactNo'];
        }
      }
    )
  }

  popFileChooser(): void {
    this.uploader.nativeElement.click();
  }
  onSelectFile(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.logo = (event.target.result);
      }
    }
  }

  getImage(){
    this.image_url = this.userService.getImageFromStorage();
  }

  getUser() {
    let user = this.tokenStorage.DecodeToken();
    this.user_id = user['user_id'];
    this.business_id = user['business_id']
  }
      
  downloadImage(){
    let image = document.getElementById("image");
    htmlToImage.toCanvas(image).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'image.png';
      this.downloadLink.nativeElement.click();
      this.userService.saveEditedImage(canvas.toDataURL(), this.user_id).subscribe( data => {
        this.alertService.presentToast(data['msg'], 'success');
        this.router.navigate(['/home']);
      })
    });
  }

  ngOnDestroy(){
    this.userService.remove('image');
  }
}