import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FAQGENERALESComponent } from './components/faqgenerales/faqgenerales.component';
import { LoginComponent } from './components/login/login.component';
import { OlvidoClaveComponent } from './components/olvido-clave/olvido-clave.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AusentismosProcesadosComponent } from './components/pages/ausentismos/ausentismos-procesados/ausentismos-procesados.component';
import { AusentismosProcesadosPersonaComponent } from './components/pages/ausentismos/ausentismos-procesados-persona/ausentismos-procesados-persona.component';
import { AusentismosComponent } from './components/pages/ausentismos/ausentismos.component';
import { ProcesarAusentismosComponent } from './components/pages/ausentismos/procesar-ausentismos/procesar-ausentismos.component';
import { ProcesarAusentismosPersonaComponent } from './components/pages/ausentismos/procesar-ausentismos-persona/procesar-ausentismos-persona.component';
import { ReportarAusentismoComponent } from './components/pages/ausentismos/reportar-ausentismo/reportar-ausentismo.component';
import { VerAusentismosReportadosComponent } from './components/pages/ausentismos/ver-ausentismos-reportados/ver-ausentismos-reportados.component';
import { CambioClaveComponent } from './components/pages/cambio-clave/cambio-clave.component';
import { CambioFotoComponent } from './components/pages/cambio-foto/cambio-foto.component';
import { ContactoComponent } from './components/pages/contacto/contacto.component';
import { DatosPersonalesComponent } from './components/pages/datos-personales/datos-personales.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { HomeComponent } from './components/pages/home/home.component';
import { Home2Component } from './components/pages/home2/home2.component';
import { InfoEstudiosComponent } from './components/pages/info-estudios/info-estudios.component';
import { InfoExperienciaComponent } from './components/pages/info-experiencia/info-experiencia.component';
import { PagesComponent } from './components/pages/pages.component';
import { ConsultarMensajeComponent } from './components/pages/recursos-humanos/consultar-mensaje/consultar-mensaje.component';
import { CrearMensajeComponent } from './components/pages/recursos-humanos/crear-mensaje/crear-mensaje.component';
import { NotificacionesMensajeComponent } from './components/pages/recursos-humanos/notificaciones-mensaje/notificaciones-mensaje.component';
import { RecursosHumanosComponent } from './components/pages/recursos-humanos/recursos-humanos.component';
import { ReportesComponent } from './components/pages/reportes/reportes.component';
import { CrearSolicitudComponent } from './components/pages/vacaciones/crear-solicitud/crear-solicitud.component';
import { ProcesarSoliciComponent } from './components/pages/vacaciones/procesar-solici/procesar-solici.component';
import { SoliProcesadasComponent } from './components/pages/vacaciones/soli-procesadas/soli-procesadas.component';
import { VacacionesComponent } from './components/pages/vacaciones/vacaciones/vacaciones.component';
import { VerSoliciEmpleadosComponent } from './components/pages/vacaciones/ver-solici-empleados/ver-solici-empleados.component';
import { VerSoliciProcPersonaComponent } from './components/pages/vacaciones/ver-solici-proc-persona/ver-solici-proc-persona.component';
import { VerSoliciSinProcPersonaComponent } from './components/pages/vacaciones/ver-solici-sin-proc-persona/ver-solici-sin-proc-persona.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ValidaTokenComponent } from './components/valida-token/valida-token.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
const routes: Routes = [
  {
    path: '', component: PagesComponent,
    children: [
      // Rutas secundarias
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'home2', component: Home2Component, canActivate: [AuthGuard] },
      { path: 'kioDatoPersonal', component: DatosPersonalesComponent, canActivate: [AuthGuard] },
      { path: 'cambioClave', component: CambioClaveComponent, canActivate: [AuthGuard] },
      { path: 'cambioFoto', component: CambioFotoComponent, canActivate: [AuthGuard] },
      { path: 'reportes', component: ReportesComponent },
      { path: 'reportes/:id', component: ReportesComponent },
      { path: 'FAQ', component: FaqComponent },
      { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
      { path: 'contacto', component: ContactoComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones', component: VacacionesComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones/crearSolicitud', component: CrearSolicitudComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones/verSolicitudesPropias', component: VerSoliciEmpleadosComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones/procesarSolicitudes', component: ProcesarSoliciComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones/solicitudesProcesadas', component: SoliProcesadasComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones/procesarSolicitudesAutorizador', component: VerSoliciSinProcPersonaComponent, canActivate: [AuthGuard] },
      { path: 'vacaciones/solicitudesProcesadasAutorizador', component: VerSoliciProcPersonaComponent, canActivate: [AuthGuard] },
      { path: 'infoEstudios', component: InfoEstudiosComponent, canActivate: [AuthGuard] },
      { path: 'infoExperienciaLab', component: InfoExperienciaComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos', component: AusentismosComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos/reportarAusentismo', component: ReportarAusentismoComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos/verAusentismosReportados', component: VerAusentismosReportadosComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos/procesarAusentismos', component: ProcesarAusentismosComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos/ausentismosProcesados', component: AusentismosProcesadosComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos/procesarAusentismosPersona', component: ProcesarAusentismosPersonaComponent, canActivate: [AuthGuard] },
      { path: 'ausentismos/ausentismosProcesadosPersona', component: AusentismosProcesadosPersonaComponent, canActivate: [AuthGuard] },
      { path: 'recursoshumanos', component: RecursosHumanosComponent, canActivate: [AuthGuard] },
      { path: 'recursoshumanos/crearMensajes', component: CrearMensajeComponent, canActivate: [AuthGuard] },
      { path: 'recursoshumanos/consultarMensajes', component: ConsultarMensajeComponent, canActivate: [AuthGuard] },
      { path: 'mensajesrh', component: NotificacionesMensajeComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: '/login/GrupoEmpresarial2', pathMatch: 'full' }
    ]
  },
  // Rutas principales
  { path: 'login/:grupo', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro/:grupo', component: RegistroComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'olvidoClave', component: OlvidoClaveComponent },
  { path: 'olvidoClave/:grupo', component: OlvidoClaveComponent },
  { path: 'validacionCuenta/:token', component: ValidaTokenComponent },
  { path: 'FAQ1', component: FAQGENERALESComponent },
  { path: '**', component: PageNotFoundComponent },
];

//export const APP_ROUTING = RouterModule.forRoot(routes, {useHash: true});

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true, 
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
