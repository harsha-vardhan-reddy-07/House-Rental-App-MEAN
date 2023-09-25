import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  userDisplayContent: string = 'home';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  properties: any[] = [];
  applications: any[] = []; 

  displayedProperties: any[] = [];

  bookingDateTime: string = '';

  ngOnInit(): void {
      this.fetchApplications();
      this.fetchProperties();
  }

  constructor(private http: HttpClient, private route: Router){}

 // fetch properties

fetchProperties(){
  this.http.get<any>('http://localhost:6001/fetch-properties').subscribe(
    (response)=>{
        this.properties = response.reverse();
        this.displayedProperties = response.reverse();
    }
  )
}

availablityTypeFilter: string = 'All';
sortType: string = 'relative';

// Property filters

// Sort filter applied

sortChanged(sort: any){
  if(sort === 'relative'){

    this.availabilityFilterChanged(this.availablityTypeFilter);

  } else if(sort === 'rent-low'){
    
    this.displayedProperties = this.displayedProperties.sort((a,b) => a.rent - b.rent);

  } else if(sort === 'rent-high'){

    this.displayedProperties = this.displayedProperties.sort((a,b) => b.rent - a.rent);

  } else if(sort === 'deposit'){

    this.displayedProperties = this.displayedProperties.sort((a,b) => a.deposit - b.deposit);

  } 
}

// availability filter applied

availabilityFilterChanged(availability: any){
  if(availability === 'All'){
    this.displayedProperties = this.properties;
  } else if(availability === 'Family'){
    this.displayedProperties = this.properties.filter((property: any)=> property.availableFor === 'Family');
  } else if(availability === 'Bachelors'){

    this.displayedProperties = this.properties.filter((property: any)=> property.availableFor === 'Bachelors');
  } else if(availability === 'Commercial'){
    this.displayedProperties = this.properties.filter((property: any)=> property.availableFor === 'Commercial');
  } 
}


 // fetch Applications
fetchApplications(){
  this.http.get<any>('http://localhost:6001/fetch-applications').subscribe(
    (response)=>{
        this.applications = response.reverse();
    }
  )
}


  
// Apply for a property

handleBooking(propertyId: any){
  this.http.post<any>('http://localhost:6001/book-property', {propertyId, userId: this.userId}).subscribe(
    (response)=>{
        alert("Application submitted!!");
        this.fetchProperties();
        this.fetchApplications();
    }
  )
}


// Withdraw booking

withdrawBooking(applicationId:any){
  this.http.post<any>('http://localhost:6001/withdraw-user-booking', {applicationId, userId: this.userId}).subscribe(
    (response)=>{
      alert("Application cancelled!!");
      this.fetchApplications();
      this.fetchProperties();
    }
  ), (error: any)=>{
    alert("Operation failed!!");
  }
}


// Vacate tenent

vacateTenent(propertyId:any){
  this.http.put<any>('http://localhost:6001/vacate-tenent', {propertyId}).subscribe(
    (response)=>{
      alert("Tenent vacated!!");
      this.fetchApplications();
      this.fetchProperties();
    }
  ), (error: any)=>{
    alert("Operation failed!!");
  }
}








  logout (){
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    this.route.navigate(['']);
  }
}
