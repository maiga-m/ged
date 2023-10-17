import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SousServiceComponent } from './list/sous-service.component';
import { SousServiceDetailComponent } from './detail/sous-service-detail.component';
import { SousServiceUpdateComponent } from './update/sous-service-update.component';
import { SousServiceDeleteDialogComponent } from './delete/sous-service-delete-dialog.component';
import { SousServiceRoutingModule } from './route/sous-service-routing.module';

@NgModule({
  imports: [SharedModule, SousServiceRoutingModule],
  declarations: [SousServiceComponent, SousServiceDetailComponent, SousServiceUpdateComponent, SousServiceDeleteDialogComponent],
})
export class SousServiceModule {}
