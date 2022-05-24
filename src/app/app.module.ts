import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgParticlesModule } from "ng-particles";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { HabilidadItemComponent } from './components/subcomponents/habilidad-item/habilidad-item.component';
import { AddBtnComponent } from './components/subcomponents/add-btn/add-btn.component';
import { EditBtnComponent } from './components/subcomponents/edit-btn/edit-btn.component';
import { DeleteBtnComponent } from './components/subcomponents/delete-btn/delete-btn.component';
import { AddEditPersonaComponent } from './components/modals/add-edit-persona/add-edit-persona.component';
import { AddEditEducacionComponent } from './components/modals/add-edit-educacion/add-edit-educacion.component';
import { AddEditExplaboralComponent } from './components/modals/add-edit-explaboral/add-edit-explaboral.component';
import { AddEditHabilidadComponent } from './components/modals/add-edit-habilidad/add-edit-habilidad.component';
import { AddEditProyectoComponent } from './components/modals/add-edit-proyecto/add-edit-proyecto.component';
import { AddEditProfilePhotoComponent } from './components/modals/add-edit-profile-photo/add-edit-profile-photo.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		HomeComponent,
		LoginComponent,
		FooterComponent,
		HabilidadItemComponent,
		AddBtnComponent,
		EditBtnComponent,
		DeleteBtnComponent,
		AddEditPersonaComponent,
		AddEditEducacionComponent,
		AddEditExplaboralComponent,
		AddEditHabilidadComponent,
		AddEditProyectoComponent,
  AddEditProfilePhotoComponent,
  LoaderComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgParticlesModule,
		HttpClientModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right'
		}),
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }