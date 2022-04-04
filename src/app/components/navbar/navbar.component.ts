import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mobileMenuOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  
  openMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

}
