import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';

// Rutas
import {APP_ROUTING} from './app.routing.module';

// Componentes
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
import { CambioFotoComponent } from './components/pages/cambio-foto/cambio-foto.component';
import { ContactoComponent } from './components/pages/contacto/contacto.component';
import { PagesComponent } from './components/pages/pages.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';


import { LOCALE_ID } from '@angular/core';
/*import { registerLocaleData } from '@angular/common';
import localeCo from '@angular/common/locales/es-co';*/
import localeEsCO from '@angular/common/locales/es-CO';
registerLocaleData(localeEsCO, 'es');
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FaqComponent } from './components/pages/faq/faq.component';
import { FAQGENERALESComponent } from './components/faqgenerales/faqgenerales.component';
import { VacacionesComponent } from './components/pages/vacaciones/vacaciones/vacaciones.component';
import { CrearSolicitudComponent } from './components/pages/vacaciones/crear-solicitud/crear-solicitud.component';
import { ProcesarSoliciComponent } from './components/pages/vacaciones/procesar-solici/procesar-solici.component';
import { VerSoliciEmpleadosComponent } from './components/pages/vacaciones/ver-solici-empleados/ver-solici-empleados.component';
import { SoliProcesadasComponent } from './components/pages/vacaciones/soli-procesadas/soli-procesadas.component';
import { FilterPipe } from './pipes/filter.pipe';

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
    PagesComponent,
    CambioFotoComponent,
    FaqComponent, // FAQ dentro de la aplicación
    FAQGENERALESComponent, // FAQ del login
    ContactoComponent,
    VacacionesComponent,
    CrearSolicitudComponent,
    ProcesarSoliciComponent,
    VerSoliciEmpleadosComponent,
    SoliProcesadasComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    APP_ROUTING/*,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })*/
  ],
  providers: [
    DatePipe, {provide: LOCALE_ID, useValue: 'es-CO'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
