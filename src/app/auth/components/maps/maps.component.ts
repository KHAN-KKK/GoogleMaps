import { Component } from '@angular/core';

import{GoogleMapsModule} from '@angular/google-maps';

@Component({
  selector: 'app-maps',
  imports: [GoogleMapsModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})


export class MapsComponent {

   map: google.maps.Map | null = null;

   constructor() {
    this.map = {} as google.maps.Map;
  }

   lat = 24.120000;
  lng = 54.650000;
  center = { lat: this.lat, lng: this.lng };
  marker: any;
  markerlistener: any;  

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const mapEl = document.getElementById('map') as HTMLElement;

    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 18,
      mapId: '4504f8b37365c3d0'
    });

    await this.addMarker(location);
  }

  async addMarker(location: any) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    //const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // const markerPin = new PinElement({
    //   background: "blue",
    //   scale: 2,
    //   borderColor: "white",
    //   glyphColor: "red",
    // });
      this.markerlistener = this.marker.addListener("dragend", (event: any) => {
      console.log(event.LatLng.lat(), event.LatLng.lng());
      this.marker.position = event.LatLng;
      this.map?.panTo(this.marker.position);
      });

     this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      gmpDraggable: true,
      //content : markerPin.element,
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }
}
