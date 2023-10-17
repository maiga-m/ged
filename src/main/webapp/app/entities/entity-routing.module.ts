import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'type-document',
        data: { pageTitle: 'gedApp.typeDocument.home.title' },
        loadChildren: () => import('./type-document/type-document.module').then(m => m.TypeDocumentModule),
      },
      {
        path: 'service',
        data: { pageTitle: 'gedApp.service.home.title' },
        loadChildren: () => import('./service/service.module').then(m => m.ServiceModule),
      },
      {
        path: 'sous-service',
        data: { pageTitle: 'gedApp.sousService.home.title' },
        loadChildren: () => import('./sous-service/sous-service.module').then(m => m.SousServiceModule),
      },
      {
        path: 'dossier',
        data: { pageTitle: 'gedApp.dossier.home.title' },
        loadChildren: () => import('./dossier/dossier.module').then(m => m.DossierModule),
      },
      {
        path: 'process',
        data: { pageTitle: 'gedApp.process.home.title' },
        loadChildren: () => import('./process/process.module').then(m => m.ProcessModule),
      },
      {
        path: 'boite',
        data: { pageTitle: 'gedApp.boite.home.title' },
        loadChildren: () => import('./boite/boite.module').then(m => m.BoiteModule),
      },
      {
        path: 'salle',
        data: { pageTitle: 'gedApp.salle.home.title' },
        loadChildren: () => import('./salle/salle.module').then(m => m.SalleModule),
      },
      {
        path: 'rayon',
        data: { pageTitle: 'gedApp.rayon.home.title' },
        loadChildren: () => import('./rayon/rayon.module').then(m => m.RayonModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
