import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PersonaModel } from 'src/app/models/Persona';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() github_link: string = '';
  @Input() facebook_link: string = '';

  mobileMenuOpen: boolean = false;
  persona : PersonaModel = new PersonaModel();
  userLoggedIn: boolean = false;
  scrollAnimationTime: number = 800;
  section2OffsetTop : number = 0;
  
  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.logIn;
    this.section2OffsetTop = document.querySelector<HTMLElement>('.intro-section')!.offsetTop;
  }
  
  openMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  scrollTo(section : string) {
    this.smoothScroll('#' + section, this.scrollAnimationTime)
  }

  logOut() {
    this.authService.doLogOut();
    //this.router.navigate(['/login']);
    //this.ngOnInit();
    location.reload();
  }

  smoothScroll(targetElement: string, duration: number) {
      let target = document.querySelector<HTMLElement>(targetElement)!;
      let targetPosition = target.offsetTop;
      let startPosition = window.scrollY;
      let distance = targetPosition - startPosition;
      let startTime = 0;
      
      function animationScroll(currentTime: number) {
          if(startTime == 0) startTime = currentTime;
          let timeElapsed = currentTime - startTime;
          let run = ease(timeElapsed, startPosition, distance - 50, duration);
          window.scrollTo(0,run);
          if(timeElapsed < duration) window.requestAnimationFrame(animationScroll);
      }
      
      // funciones de ease -> https://www.gizma.com/easing/
      function ease(t:number, b:number, c:number, d:number) {
          t /= d/2;
          if (t < 1) return c/2*t*t + b;
          t--;
          return -c/2 * (t*(t-2) - 1) + b;
      }
      
      window.requestAnimationFrame(animationScroll);
  }

  @HostListener("window:scroll", [])
  backToTopInit() {
    const backToTopBtn = document.getElementById('backToTopBtn')!;
    if(window.scrollY > (this.section2OffsetTop - (this.section2OffsetTop/1.1))) {
      document.querySelector<HTMLElement>('nav')!.classList.add('nav-scroll');
      backToTopBtn.classList.remove('btn-back-to-top-hidden');
    } else {
        document.querySelector<HTMLElement>('nav')!.classList.remove('nav-scroll');
        backToTopBtn.classList.add('btn-back-to-top-hidden');
    }
  }
}