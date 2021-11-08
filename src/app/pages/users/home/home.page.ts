import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/services/tokenstorage.service'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  templates
  username: string;
  user_id: Number;
  temp: string;
  result;
  
  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router,
    private _alertController : AlertController,
    private _alertService : AlertService
  ) { }
  
  
  ngOnInit() {
    this.getTemplates()
    this.getUser();
  }

  getUser() {
    let user = this.tokenStorage.DecodeToken();
    this.username = user['username'];
    this.user_id = user['user_id']
  }
  
  async edit(value) {
    await this.userService.checkReferal(this.user_id).subscribe(
      data => {
        this.result = data;
        if(this.result == null) {
          this.presentAlertPrompt(value);
        } else {
          this.userService.addImageToStorage(value);
          this.router.navigate(['/editimage']);
        }
      }
    )
  }
  
  async presentAlertPrompt(value) {
    const alert = await this._alertController.create({
      header: 'Enter Referal Code',
      inputs: [
        {
          name: 'code',
          type: 'number',
          placeholder: 'Referal Code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        }, {
          text: 'Ok',
          handler: (alertData) => {
            this.userService.assignReferal(this.user_id, alertData.code).subscribe(
              data=> {
                if(data == true) {
                  this.userService.addImageToStorage(value);
                  this.router.navigate(['/editimage']);
                } else {
                  this._alertService.presentToast(data['error'], 'danger')
                }
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }

  async getTemplates() {
    await this.userService.getTemplate().subscribe(
      data => {
        this.templates = data['template']
      }
    )
  }
}
