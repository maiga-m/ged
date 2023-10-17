import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SousServiceComponent } from '../list/sous-service.component';
import { SousServiceDetailComponent } from '../detail/sous-service-detail.component';
import { SousServiceUpdateComponent } from '../update/sous-service-update.component';
import { SousServiceRoutingResolveService } from './sous-service-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sousServiceRoute: Routes = [
  {
    path: '',
    component: SousServiceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SousServiceDetailComponent,
    resolve: {
      sousService: SousServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SousServiceUpdateComponent,
    resolve: {
      sousService: SousServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SousServiceUpdateComponent,
    resolve: {
      sousService: SousServiceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sousServiceRoute)],
  exports: [RouterModule],
})
export class SousServiceRoutingModule {}
