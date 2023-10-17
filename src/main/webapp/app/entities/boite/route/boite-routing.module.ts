import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BoiteComponent } from '../list/boite.component';
import { BoiteDetailComponent } from '../detail/boite-detail.component';
import { BoiteUpdateComponent } from '../update/boite-update.component';
import { BoiteRoutingResolveService } from './boite-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const boiteRoute: Routes = [
  {
    path: '',
    component: BoiteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BoiteDetailComponent,
    resolve: {
      boite: BoiteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BoiteUpdateComponent,
    resolve: {
      boite: BoiteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BoiteUpdateComponent,
    resolve: {
      boite: BoiteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(boiteRoute)],
  exports: [RouterModule],
})
export class BoiteRoutingModule {}
