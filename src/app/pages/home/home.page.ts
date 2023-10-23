import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';

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
 

  public surveyList!: SurveyList;

  constructor(private fb: FormBuilder, private router:Router) { }

  ngOnInit() {
  }

  goToCreateSurvey () {
    this.router.navigate(['create-survey'])
  }
}
