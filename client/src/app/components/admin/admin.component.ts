import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminDisplayContent: string = 'home';

  username: string|null = localStorage.getItem('username');
  userId: string|null = localStorage.getItem('userid');

  properties: any[] = [];
  applications: any[] = []; 
  users: any[] = [];

  displayedProperties: any[] = [];

  availablityTypeFilter: string = 'All';
  sortType: string = 'relative';


  constructor(private route: Router, private http: HttpClient){}


  ngOnInit(): void {
    this.fetchApplications();
    this.fetchProperties();
    this.fetchUsers();
}


// fetch properties

fetchProperties(){
  this.http.get<any>('http://localhost:6001/fetch-properties').subscribe(
    (response)=>{
        this.properties = response.reverse();
        
        this.displayedProperties = response.reverse();

    }
  )
}

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
    this.displayedProperties = this.displayedProperties.filter((property: any)=> property.availableFor === 'Family');
  } else if(availability === 'Bachelors'){
    this.displayedProperties = this.displayedProperties.filter((property: any)=> property.availableFor === 'Bachelors');
  } else if(availability === 'Commercial'){
    this.displayedProperties = this.displayedProperties.filter((property: any)=> property.availableFor === 'Commercial');
  } 
}


// freeze property  - cancels tenent and disables from public

freezeProperty(id: any){
  this.http.put<any>('http://localhost:6001/freeze-property', {id}).subscribe(
    (response)=>{
        alert('Property freezed');
        this.fetchProperties();
    }
  )
}


// fetch Applications
fetchApplications(){
  this.http.get<any>('http://localhost:6001/fetch-applications').subscribe(
    (response)=>{
        this.applications = response.reverse();
    }
  )
}


// fetch users

fetchUsers(){
  this.http.get<any>('http://localhost:6001/fetch-users').subscribe(
    (response)=>{
        this.users = response.reverse();
    }
  )
}



// Properties taken for rent by user

rentedCount(userId: any){
  let count = 0;
  
  this.properties.map((property)=>{
    if(property.tenentId === userId){
      count = count + 1;
    }
  })
  return count;
}


// Applications count

applicationsCount(userId: any){
  let count = 0;
  this.applications.map((application)=>{
    if(application.applicantId === userId){
      count = count + 1
    }
  })
  return count;
}



// total properties owned by owner

propertiesOwned(userId: any){
  let count = 0;
  
  this.properties.map((property)=>{
    if(property.ownerId === userId){
      count = count + 1;
    }
  })
  return count;
}

// Properties taken for rent by user

propertiesRented(userId: any){
  let count = 0;
  
  this.properties.map((property)=>{
    if(property.ownerId === userId && property.status === "Booked"){
      count = count + 1;
    }
  })
  return count;
  
}

// Properties taken for rent by user

propertiesAvailable(userId: any){
  let count = 0;
  
  this.properties.map((property)=>{
    if(property.ownerId === userId && property.status === 'Available'){
      count = count + 1;
    }
  })
  return count;

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
