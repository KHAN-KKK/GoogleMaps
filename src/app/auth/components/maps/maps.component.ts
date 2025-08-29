import { Component } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps';

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

  lat = 24.419497;  //--24.419497 54.486835
  lng = 54.486835;
  center = { lat: this.lat, lng: this.lng };
  marker: any;
  markerlistener: any;

  berths = [
    { lat: 24.12, lng: 54.65, status: 'available' },
    { lat: 24.121, lng: 54.651, status: 'booked' },
  ];

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const mapEl = document.getElementById('map') as HTMLElement;

    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 20,
      mapId: '4504f8b37365c3d0'
    });

    await this.addMarker(location);
  }

  async addMarker(location: any) {
    //const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // const markerPin = new PinElement({
    //   background: "blue",
    //   scale: 2,
    //   borderColor: "white",
    //   glyphColor: "red",
    // });

    const markerIcon = document.createElement('img');
    markerIcon.src = 'assets/BerthHighlighted.svg';
    markerIcon.height = 100;
    markerIcon.width = 40;

    // this.markerlistener = this.marker.addListener("dragend", (event: any) => {
    // console.log(event.LatLng.lat(), event.LatLng.lng());
    // this.marker.position = event.LatLng;
    // this.map?.panTo(this.marker.position);
    // });

    this.berths.forEach(b => {
      // Create a new DOM element for this marker
      const el = document.createElement('div');
      el.style.width = '50px';
      el.style.height = '50px';

      const img = document.createElement('img');
      img.src = b.status === 'booked' ? 'assets/boat.svg' : 'assets/Berth.svg';
      img.style.width = '100%';
      img.style.height = '100%';

      el.appendChild(img);

      // Create AdvancedMarkerElement with this unique element
      new AdvancedMarkerElement({
        position: { lat: b.lat, lng: b.lng },
        map: this.map,
        content: el
      });
    });




    //  this.marker = new AdvancedMarkerElement({
    //   map: this.map,
    //   position: location,
    //   gmpDraggable: true,
    //   content : markerIcon,
    //content : markerPin.element,
    // });
  }

  ngAfterViewInit() {
    this.initMap();
  }
}
