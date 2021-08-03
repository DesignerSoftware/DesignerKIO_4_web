import {RouterModule, Routes} from '@angular/router';
import { PagesComponent } from './components/pages/pages.component';
import { HomeComponent } from './components/pages/home/home.component';
import { Home2Component } from './components/pages/home2/home2.component';  // Messer - Remeo
import { DatosPersonalesComponent } from './components/pages/datos-personales/datos-personales.component';
import { CambioClaveComponent } from './components/pages/cambio-clave/cambio-clave.component';
import { ReportesComponent } from './components/pages/reportes/reportes.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { OlvidoClaveComponent } from './components/olvido-clave/olvido-clave.component';
import { ValidaTokenComponent } from './components/valida-token/valida-token.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { CambioFotoComponent } from './components/pages/cambio-foto/cambio-foto.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { FAQGENERALESComponent } from './components/faqgenerales/faqgenerales.component';
import { ContactoComponent } from './components/pages/contacto/contacto.component';
import { VacacionesComponent } from './components/pages/vacaciones/vacaciones/vacaciones.component';
import { CrearSolicitudComponent } from './components/pages/vacaciones/crear-solicitud/crear-solicitud.component';
import { VerSoliciEmpleadosComponent } from './components/pages/vacaciones/ver-solici-empleados/ver-solici-empleados.component';
import { ProcesarSoliciComponent } from './components/pages/vacaciones/procesar-solici/procesar-solici.component';
import { SoliProcesadasComponent } from './components/pages/vacaciones/soli-procesadas/soli-procesadas.component';
import { InfoEstudiosComponent } from './components/pages/info-estudios/info-estudios.component';
import { AusentismosComponent } from './components/pages/ausentismos/ausentismos.component';
import { ReportarAusentismoComponent } from './components/pages/ausentismos/reportar-ausentismo/reportar-ausentismo.component';
import { VerAusentismosReportadosComponent } from './components/pages/ausentismos/ver-ausentismos-reportados/ver-ausentismos-reportados.component';
import { ProcesarAusentismosComponent } from './components/pages/ausentismos/procesar-ausentismos/procesar-ausentismos.component';
import { AusentismosProcesadosComponent } from './components/pages/ausentismos/ausentismos-procesados/ausentismos-procesados.component';
import { InfoExperienciaComponent } from './components/pages/info-experiencia/info-experiencia.component';
import { VerSoliciSinProcPersonaComponent } from './components/pages/vacaciones/ver-solici-sin-proc-persona/ver-solici-sin-proc-persona.component';
import { VerSoliciProcPersonaComponent } from './components/pages/vacaciones/ver-solici-proc-persona/ver-solici-proc-persona.component';


const APP_ROUTES: Routes = [
    {
    path: '',
     component: PagesComponent,
     children: [
    // Rutas secundarias
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'home2', component: Home2Component, canActivate: [AuthGuard]},    
    {path: 'kioDatoPersonal', component: DatosPersonalesComponent, canActivate: [AuthGuard,RoleGuard]},
    {path: 'cambioClave', component: CambioClaveComponent, canActivate: [AuthGuard]},
    {path: 'cambioFoto', component: CambioFotoComponent, canActivate: [AuthGuard]},
    {path: 'reportes', component: ReportesComponent },
    {path: 'reportes/:id', component: ReportesComponent},
    {path: 'FAQ', component: FaqComponent},
    {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
    {path: 'contacto', component: ContactoComponent, canActivate: [AuthGuard]},
    {path: 'vacaciones', component: VacacionesComponent, canActivate: [AuthGuard]},
    {path: 'vacaciones/crearSolicitud', component: CrearSolicitudComponent, canActivate: [AuthGuard && ( RoleGuard )]},
    {path: 'vacaciones/verSolicitudesPropias', component: VerSoliciEmpleadosComponent, canActivate: [AuthGuard]},
    {path: 'vacaciones/procesarSolicitudes', component: ProcesarSoliciComponent, canActivate: [AuthGuard]},
    {path: 'vacaciones/solicitudesProcesadas', component: SoliProcesadasComponent, canActivate: [AuthGuard]},
    {path: 'vacaciones/procesarSolicitudesAutorizador', component: VerSoliciSinProcPersonaComponent, canActivate: [AuthGuard]},    
    {path: 'vacaciones/solicitudesProcesadasAutorizador', component: VerSoliciProcPersonaComponent, canActivate: [AuthGuard]},
    {path: 'infoEstudios', component: InfoEstudiosComponent, canActivate: [RoleGuard , AuthGuard] },
    {path: 'infoExperienciaLab', component: InfoExperienciaComponent, canActivate: [AuthGuard,RoleGuard]},
    {path: 'ausentismos', component: AusentismosComponent, canActivate: [AuthGuard && ( RoleGuard )]},
    {path: 'ausentismos/reportarAusentismo', component: ReportarAusentismoComponent, canActivate: [AuthGuard]},
    {path: 'ausentismos/verAusentismosReportados', component: VerAusentismosReportadosComponent, canActivate: [AuthGuard]},
    {path: 'ausentismos/procesarAusentismos', component: ProcesarAusentismosComponent, canActivate: [AuthGuard]},
    {path: 'ausentismos/ausentismosProcesados', component: AusentismosProcesadosComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: '/login/GrupoEmpresarial2', pathMatch: 'full'}
]},
// Rutas principales
{path: 'login/:grupo', component: LoginComponent },
{path: 'login', component: LoginComponent },
{path: 'registro/:grupo', component: RegistroComponent },
{path: 'registro', component: RegistroComponent },
{path: 'olvidoClave', component: OlvidoClaveComponent },
{path: 'olvidoClave/:grupo', component: OlvidoClaveComponent },
{path: 'validacionCuenta/:token', component: ValidaTokenComponent},
{path: 'FAQ1', component: FAQGENERALESComponent},
{path: '**', component: PageNotFoundComponent},
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
