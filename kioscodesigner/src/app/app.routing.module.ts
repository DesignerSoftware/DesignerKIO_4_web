import {RouterModule, Routes} from '@angular/router';
import { PagesComponent } from './components/pages/pages.component';
import { HomeComponent } from './components/pages/home/home.component';
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
import { CambioFotoComponent } from './components/pages/cambio-foto/cambio-foto.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { FAQGENERALESComponent } from './components/faqgenerales/faqgenerales.component';

const APP_ROUTES: Routes = [
    {
    path: '',
     component: PagesComponent,
     children: [
    // Rutas secundarias
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'kioDatoPersonal', component: DatosPersonalesComponent, canActivate: [AuthGuard]},
    {path: 'cambioClave', component: CambioClaveComponent, canActivate: [AuthGuard]},
    {path: 'cambioFoto', component: CambioFotoComponent, canActivate: [AuthGuard]},
    {path: 'reportes', component: ReportesComponent },
    {path: 'reportes/:id', component: ReportesComponent},
    {path: 'FAQ', component: FaqComponent},
    {path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: '/login', pathMatch: 'full'}
]},
// Rutas principales
{path: 'login', component: LoginComponent },
{path: 'registro', component: RegistroComponent },
{path: 'olvidoClave', component: OlvidoClaveComponent },
{path: 'validacionCuenta/:token', component: ValidaTokenComponent},
{path: 'FAQ1', component: FAQGENERALESComponent},
{path: '**', component: PageNotFoundComponent},
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
