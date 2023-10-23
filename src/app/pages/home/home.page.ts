import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';

import { OverlayEventDetail } from '@ionic/core/components';
import { environment } from 'src/environments/environment';

interface coordinates {
  latitude: number;
  longitude: number
}
interface SurveyList {
  shopImage: string;
  shopName: string;
  ownerName: string;
  cordinates: coordinates[];
}



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})



export class HomePage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;

  newMap!: GoogleMap;
  public surveyList!: SurveyList;
  public surveyForm!: FormGroup;
  public currentCoordinates!: coordinates;
  public newCoordinates !: coordinates;
  apiKey = environment.MapsKey;
  public isModalOpen: boolean = false;

  public isMapModelOpen: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
    this.printCurrentPosition();
  }

  // ionViewDidEnter() {
  //   this.initializeMap();
  // }
  initializeForm() {
    this.surveyForm = this.fb.group({
      shopeName: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      ownerName: ['', [Validators.required]],
      coordinates: [[]]
    })
  }

  setOpen(isOpen: boolean) {

    this.isModalOpen = isOpen;
  }

  setMapModelOpen(isOpen: boolean) {
    if (!!isOpen) {
      setTimeout(() => {
        this.initializeMap();
      }, 2000);
    }
    this.isMapModelOpen = isOpen;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.surveyForm.valid) {
      return;
    }
    this.modal.dismiss(this.surveyForm, 'confirm');
  }


  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // add to list.
    }
  }

  async printCurrentPosition() {
    const coords = await Geolocation.getCurrentPosition();
    const cordinate = {
      'latitude': coords.coords.latitude,
      'longitude': coords.coords.longitude
    }
    this.currentCoordinates = cordinate;
    console.log('Current position:', coords, this.currentCoordinates);
  };

  async initializeMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-cool-map', // Unique identifier for this map instance
      element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
      apiKey: environment.MapsKey, // Your Google Maps API Key
      // forceCreate: true,
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
  // async addMarkers() {
  //   const markers = Marker
  // }
}
