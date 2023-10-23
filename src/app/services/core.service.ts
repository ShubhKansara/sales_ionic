import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private toastController: ToastController) { }

  async toast(message:string, duration:number = 1500, position: 'top' | 'middle' | 'bottom' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });
    await toast.present();
  }

}
