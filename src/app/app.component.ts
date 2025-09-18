import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly platform: Platform,
    private readonly toastController: ToastController,
    private readonly swUpdate: SwUpdate,
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(async () => {
        const toast = await this.toastController.create({
          message: 'A new version is available. Tap to refresh.',
          buttons: [
            {
              text: 'Reload',
              role: 'reload',
              handler: () => document.location.reload(),
            },
          ],
          position: 'top',
        });
        await toast.present();
      });
    }
  }

  private initializeApp(): void {
    this.platform.ready().then(() => {
      // Reserved for future native initialization logic.
    });
  }
}
