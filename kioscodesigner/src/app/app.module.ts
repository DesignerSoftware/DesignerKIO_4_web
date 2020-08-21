import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import {APP_ROUTING} from './app.routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { OlvidoClaveComponent } from './components/olvido-clave/olvido-clave.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DatosPersonalesComponent } from './components/pages/datos-personales/datos-personales.component';
import { ReportesComponent } from './components/pages/reportes/reportes.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ValidaTokenComponent } from './components/valida-token/valida-token.component';
import { CambioClaveComponent } from './components/pages/cambio-clave/cambio-clave.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { PagesComponent } from './components/pages/pages.component';

import { HttpClientModule, HttpClient} from '@angular/common/http';

import { LOCALE_ID } from '@angular/core';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OlvidoClaveComponent,
    RegistroComponent,
    PageNotFoundComponent,
    HomeComponent,
    DatosPersonalesComponent,
    ReportesComponent,
    AboutComponent,
    ValidaTokenComponent,
    CambioClaveComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    APP_ROUTING
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-co'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
