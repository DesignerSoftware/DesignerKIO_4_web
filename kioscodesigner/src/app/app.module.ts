import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgChartsModule, ThemeService } from 'ng2-charts';
import { DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LOCALE_ID } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { OlvidoClaveComponent } from './components/olvido-clave/olvido-clave.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ValidaTokenComponent } from './components/valida-token/valida-token.component';
import { FAQGENERALESComponent } from './components/faqgenerales/faqgenerales.component';
import { FooterComponent } from './components/shared/footer/footer/footer.component';
import { NavbarComponent } from './components/shared/navbar/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar/sidebar.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AusentismosComponent } from './components/pages/ausentismos/ausentismos.component';
import { CambioClaveComponent } from './components/pages/cambio-clave/cambio-clave.component';
import { CambioFotoComponent } from './components/pages/cambio-foto/cambio-foto.component';
import { ContactoComponent } from './components/pages/contacto/contacto.component';
import { DatosPersonalesComponent } from './components/pages/datos-personales/datos-personales.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { HomeComponent } from './components/pages/home/home.component';
import { Home2Component } from './components/pages/home2/home2.component';
import { InfoEstudiosComponent } from './components/pages/info-estudios/info-estudios.component';
import { InfoExperienciaComponent } from './components/pages/info-experiencia/info-experiencia.component';
import { RecursosHumanosComponent } from './components/pages/recursos-humanos/recursos-humanos.component';
import { AusentismosProcesadosComponent } from './components/pages/ausentismos/ausentismos-procesados/ausentismos-procesados.component';
import { ProcesarAusentismosComponent } from './components/pages/ausentismos/procesar-ausentismos/procesar-ausentismos.component';
import { ReportarAusentismoComponent } from './components/pages/ausentismos/reportar-ausentismo/reportar-ausentismo.component';
import { VerAusentismosReportadosComponent } from './components/pages/ausentismos/ver-ausentismos-reportados/ver-ausentismos-reportados.component';
import { ConsultarMensajeComponent } from './components/pages/recursos-humanos/consultar-mensaje/consultar-mensaje.component';
import { CrearMensajeComponent } from './components/pages/recursos-humanos/crear-mensaje/crear-mensaje.component';
import { NotificacionesMensajeComponent } from './components/pages/recursos-humanos/notificaciones-mensaje/notificaciones-mensaje.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PagesComponent } from './components/pages/pages.component';
import { ReportesComponent } from './components/pages/reportes/reportes.component';
import { VacacionesComponent } from './components/pages/vacaciones/vacaciones/vacaciones.component';
import { CrearSolicitudComponent } from './components/pages/vacaciones/crear-solicitud/crear-solicitud.component';
import { ProcesarSoliciComponent } from './components/pages/vacaciones/procesar-solici/procesar-solici.component';
import { SoliProcesadasComponent } from './components/pages/vacaciones/soli-procesadas/soli-procesadas.component';
import { VerSoliciEmpleadosComponent } from './components/pages/vacaciones/ver-solici-empleados/ver-solici-empleados.component';
import { VerSoliciProcPersonaComponent } from './components/pages/vacaciones/ver-solici-proc-persona/ver-solici-proc-persona.component';
import { VerSoliciSinProcPersonaComponent } from './components/pages/vacaciones/ver-solici-sin-proc-persona/ver-solici-sin-proc-persona.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    OlvidoClaveComponent,
    RegistroComponent,
    ValidaTokenComponent,
    FAQGENERALESComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AboutComponent,
    AusentismosComponent,
    CambioClaveComponent,
    CambioFotoComponent,
    ContactoComponent,
    DatosPersonalesComponent,
    FaqComponent,
    HomeComponent,
    Home2Component,
    InfoEstudiosComponent,
    InfoExperienciaComponent,
    RecursosHumanosComponent,
    AusentismosProcesadosComponent,
    ProcesarAusentismosComponent,
    ReportarAusentismoComponent,
    VerAusentismosReportadosComponent,
    ConsultarMensajeComponent,
    CrearMensajeComponent,
    NotificacionesMensajeComponent,
    PagesComponent,
    ReportesComponent,
    VacacionesComponent,
    CrearSolicitudComponent,
    ProcesarSoliciComponent,
    SoliProcesadasComponent,
    VerSoliciEmpleadosComponent,
    VerSoliciProcPersonaComponent,
    VerSoliciSinProcPersonaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule, 
    HttpClientModule
  ],
  providers: [
    DatePipe, {provide: LOCALE_ID, useValue: 'es-CO'},
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
