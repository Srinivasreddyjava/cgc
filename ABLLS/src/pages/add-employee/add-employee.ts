import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, Platform, Loading } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-add-employee',
  templateUrl: 'add-employee.html',
})
export class AddEmployeePage {
  lastImage: string = null;
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private auth: AuthService, private toast: ToastController,
  private camera: Camera, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform) {}

  onAddEmp(f: any){
    // Loading
    const load = this.loadingCtrl.create({
      content: 'Adding employee..'
    });
    load.present();
    // Add employee here
    const emp = {
      name: f.value.name,
      mobile: f.value.mobile,
      email: f.value.email,
      password: f.value.password,
      number: f.value.number
    };
    console.log(f.value.number);
    this.auth.addEmployee(emp).subscribe(res => {
      if(res.success) {
        load.dismiss();
        const toast = this.toast.create({
          message: 'Employee added successfully !',
          duration: 1200
        });
        toast.present();
        f.reset();
        load.dismiss();
      }else {
        load.dismiss();
        console.log(res);
      }
    }, err => { console.error(err); });
  }

  presentAccessControl(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };

  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          console.log(correctPath);
          console.log(currentName);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      console.log(correctPath);
      console.log(currentName);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
presentToast(text) {
  let toast = this.toast.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
pathForImage(img) {
 if (img === null) {
   return '';
 } else {
   window.resolveLocalFileSystemURL( cordova.file.dataDirectory +img, function (fileEntry) {
    fileEntry.file(function (file) {
			var reader = new FileReader();
			reader.onloadend = function (event) {
				console.log(event)
			};
			reader.readAsDataURL(file);
		});
	});
   return cordova.file.dataDirectory + img;
 }
}
uploadImage() {

}
}
