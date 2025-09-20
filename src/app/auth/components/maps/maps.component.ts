import { Component } from '@angular/core';
import {MarinaBerth} from '../../../models/MarinaBerth';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-maps',
  imports: [GoogleMapsModule, CommonModule, MatTooltipModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})


export class MapsComponent {
  highlightedBerthIds: any[] = [];
  allBerths: any[] = [];
  selectedBerth: MarinaBerth | null = null;
  isBerthHighligthted: boolean = false;
  hoveredItem = null;


  map: google.maps.Map | null = null;
  intersectionObserver!: IntersectionObserver;

  constructor() {
    this.map = {} as google.maps.Map; //24.4195189803987 New Lng: 54.48674469890857  //24.419395667362135 New Lng: 54.48701347891938
  }

  //RABDNA SLIP WAY 24.392070  54.513670
  //--24.419497 54.486835  RABDAN WET 
  //rabdan 24.4195189, lng: 54.4867446  //24.4193956, lng: 54.4870134 rabdan slip
  lat = 24.392070;
  lng = 54.513670;
  center = { lat: this.lat, lng: this.lng };
  marker: any;
  markerlistener: any;

  berths = [
    // { id: 1, lat: 24.4195189, lng: 54.4867446, status: 'booked', angle: 176 },
    // { id: 2, lat: 24.419353267, lng: 54.4870232, status: 'booked', angle: -3 },
    { Id: 1,Berth:'A-1', lat: 24.3923937, lng: 54.5139377,BerthLength : '8m', status: 'booked',IsActive : true, IsBooked : true,  angle: 0 },
    { Id: 2,Berth:'A-2', lat: 24.3923821, lng: 54.5139879,BerthLength : '16m',status: 'booked',IsActive : true, IsBooked : true,  angle: 0 },
    { Id: 3,Berth:'B-1', lat: 24.3923675, lng: 54.5140329,BerthLength : '8m', status: 'booked',IsActive : true, IsBooked : false,  angle: -2 },
    { Id: 4,Berth:'B-2', lat: 24.3923518, lng: 54.5140758,BerthLength : '4m', status: 'booked',IsActive : true, IsBooked : true,  angle: -2 },
    { Id: 5,Berth:'B-3', lat: 24.3923391, lng: 54.5141253,BerthLength : '8m', status: 'booked',IsActive : true, IsBooked : true,  angle: -2 },
    { Id: 6,Berth:'A-4', lat: 24.3924058, lng: 54.5138926,BerthLength : '10m',status: 'booked',IsActive : false, IsBooked : false,  angle: 0 },
    { Id: 7,Berth:'B-4', lat: 24.3921908, lng: 54.5136703,BerthLength : '8m', status: 'booked',IsActive : true, IsBooked : true,  angle: 215 },
  ];

  //24.392413129306018 New Lng: 54.5138426736107
  //24.419353267347905 New Lng: 54.48702323473909


  async initMap() {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const mapEl = document.getElementById('map') as HTMLElement;

    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 20,
      mapId: '4504f8b37365c3d0',
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      scrollwheel: false,
      scaleControl: false,
    });

    await this.addMarker(location);
    this.allBerths = this.berths;
    // this.map.addListener('zoom_changed', () => {
    //   if (this.map) {
    //     const zoom = this.map.getZoom() || 18;
    //     const scale = this.getScaleForZoom(zoom);
    //     document.querySelectorAll('.custom-marker').forEach(el => {
    //       (el as HTMLElement).style.transform = `scale(${scale})`;
    //     });
    //   }
    // });


  }

  async addMarker(location: any) {
    //const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const pinElement = new PinElement();
    const el = pinElement.element;

    const markerIcon = document.createElement('img');
    markerIcon.src = 'assets/Berth.svg';
    markerIcon.height = 100;
    markerIcon.width = 40;

    this.berths.forEach(b => {
      // Create a new DOM element for this marker
      const el = document.createElement('div');

      el.className = 'custom-marker';
      //el.style.width = '45px';
      //el.style.height = '130px';

      const img = document.createElement('img');
      img.src = b.status === 'booked' ? 'assets/boat.svg' : 'assets/Berth.svg';
      img.style.width = '40px';
      img.style.height = '100px';
      img.style.transform = `rotate(${b.angle || 0}deg)`;
      img.style.transition = 'transform 0.3s ease';

      el.appendChild(img);

      // Create AdvancedMarkerElement with this unique element
      const marker = new AdvancedMarkerElement({
        position: { lat: b.lat, lng: b.lng },
        map: this.map,
        content: el,
        gmpDraggable: true
      });

      console.log('Marker created for:', b.lat, b.lng);

      marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          console.log('New Lat:', lat, 'New Lng:', lng,);
          this.map?.panTo(event.latLng);
          //alert(`Marker moved to: \nLat: ${lat}\nLng: ${lng}`);
        }
      });

      marker.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (this.marker.getAnimation() !== null) {
          this.marker.setAnimation(null);
        } else {
          this.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      });

      el.style.opacity = '0';
      setTimeout(() => {
        el.classList.remove('drop');
        el.style.opacity = '1';
      }, 2500);

      el.addEventListener('click', () => {
        el.classList.add('slide-in'); // or slide-in, rotate, etc.
        setTimeout(() => {
          el.classList.remove('slide-in');
        }, 2000); // remove after 2s
      });

      this.intersectionObserver.observe(el);
    });
  }

  getScaleForZoom(zoom: number): number {
    const baseZoom = 18; // Your default zoom
    const baseScale = 1; // Original size at baseZoom
    return baseScale * Math.pow(1.2, (zoom - baseZoom));
  }



  ngAfterViewInit() {
    this.initMap();
    this.intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('drop');
          this.intersectionObserver.unobserve(entry.target);
        }
      }
    });
  }

  onMarkerClick(berth: any) {

    this.selectedBerth = this.selectedBerth?.Id === berth.Id ? null : berth;
    if (this.selectedBerth) {
      const newCenter = { lat: this.selectedBerth.Latitude, lng: this.selectedBerth.Longitude };
      this.map?.panTo(newCenter);
      //marker.marker?.setAnimation(google.maps.Animation.BOUNCE);

      //   setTimeout(() => {
      //   marker.marker?.setAnimation(null);
      // }, 700);

      this.isBerthHighligthted = this.highlightedBerthIds.includes(berth.Id);

    }
    this.highlightedBerthIds = [];  // this will remove the highlighted berths if the user clicks on berth
  }


}
