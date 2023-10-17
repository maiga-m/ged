import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RayonComponent } from './list/rayon.component';
import { RayonDetailComponent } from './detail/rayon-detail.component';
import { RayonUpdateComponent } from './update/rayon-update.component';
import { RayonDeleteDialogComponent } from './delete/rayon-delete-dialog.component';
import { RayonRoutingModule } from './route/rayon-routing.module';

@NgModule({
  imports: [SharedModule, RayonRoutingModule],
  declarations: [RayonComponent, RayonDetailComponent, RayonUpdateComponent, RayonDeleteDialogComponent],
})
export class RayonModule {}
