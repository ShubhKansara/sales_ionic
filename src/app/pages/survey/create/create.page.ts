import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { SurveyList, coordinates } from 'src/app/types/types';
import { environment } from 'src/environments/environment';
import { OverlayEventDetail } from '@ionic/core/components';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  @ViewChild(IonModal) modal!: IonModal;
  newMap!: GoogleMap;
  public isModalOpen: boolean = false;

  public surveyForm!: FormGroup;
  public currentCoordinates: coordinates = {
    latitude: 0,
    longitude:0
  };
  public newCoordinates: coordinates = {
    latitude: 0,
    longitude:0
  };
  apiKey = environment.MapsKey;
  constructor(private fb: FormBuilder, private core: CoreService) {
  }

  ngOnInit() {
    this.initializeForm();
    this.printCurrentPosition();
  }

  initializeForm() {
    this.surveyForm = this.fb.group({
      shopeName: ['', [Validators.required]],
      shopImage: [null, [Validators.required]],
      ownerName: ['', [Validators.required]],
      coordinates: [[]],
    });
  }

  async printCurrentPosition() {
    const coords = await Geolocation.getCurrentPosition();
    const cordinate = {
      latitude: coords.coords.latitude,
      longitude: coords.coords.longitude,
    };
    this.currentCoordinates = cordinate;
    console.log('Current position:', coords, this.currentCoordinates);
    console.warn(this.currentCoordinates);
  }

  getLatitude() {
    return this.currentCoordinates.latitude;
  }
  getLogitude() {
    return this.currentCoordinates.longitude;
  }


  setMapModelOpen(isOpen: boolean) {
    if (!!isOpen) {
      setTimeout(() => {
        this.initializeMap();
      }, 0);
    }
    this.isModalOpen = isOpen;
  }

  async initializeMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-map', 
      element: this.mapRef.nativeElement, 
      apiKey: environment.MapsKey, // Your Google Maps API Key
      forceCreate: true,
      config: {
        center: {
          lat: this.currentCoordinates.latitude,
          lng: this.currentCoordinates.longitude,
        },
        zoom: 8,
      },
    });

    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: this.currentCoordinates.latitude,
        lng: this.currentCoordinates.longitude,
      },
      draggable: true
    });

    this.MapEvents();

  }

  async MapEvents() {
    await this.newMap.setOnMarkerDragEndListener((event) => {
      console.log("event..", event);
      const coords: coordinates = {
        latitude: event.latitude,
        longitude: event.longitude
      }
      this.newCoordinates = coords;
    });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.currentCoordinates = this.newCoordinates;
      this.surveyForm.value.coordinates = this.currentCoordinates;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.surveyForm, 'confirm');
  }

  saveSurvey() {
    if(!this.surveyForm.valid) {
      console.log("invalid");
      this.core.toast("fill the form properly.")
      return;
    }else {
        const surveyItem: SurveyList = {
          cordinates: this.surveyForm.get("coordinates")?.value,
          ownerName: this.surveyForm.get("shopeName")?.value,
          shopImage: this.surveyForm.get("shopImage")?.value,
          shopName: this.surveyForm.get("shopName")?.value,
        }


        console.warn(surveyItem)
    }
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    this.surveyForm.value.shopImage = file;
  }


  saveFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      localStorage.setItem('profile', reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
