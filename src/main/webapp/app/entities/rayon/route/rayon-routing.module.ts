import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RayonComponent } from '../list/rayon.component';
import { RayonDetailComponent } from '../detail/rayon-detail.component';
import { RayonUpdateComponent } from '../update/rayon-update.component';
import { RayonRoutingResolveService } from './rayon-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const rayonRoute: Routes = [
  {
    path: '',
    component: RayonComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RayonDetailComponent,
    resolve: {
      rayon: RayonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RayonUpdateComponent,
    resolve: {
      rayon: RayonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RayonUpdateComponent,
    resolve: {
      rayon: RayonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rayonRoute)],
  exports: [RouterModule],
})
export class RayonRoutingModule {}
