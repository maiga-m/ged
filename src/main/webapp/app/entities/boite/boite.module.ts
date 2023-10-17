import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BoiteComponent } from './list/boite.component';
import { BoiteDetailComponent } from './detail/boite-detail.component';
import { BoiteUpdateComponent } from './update/boite-update.component';
import { BoiteDeleteDialogComponent } from './delete/boite-delete-dialog.component';
import { BoiteRoutingModule } from './route/boite-routing.module';

@NgModule({
  imports: [SharedModule, BoiteRoutingModule],
  declarations: [BoiteComponent, BoiteDetailComponent, BoiteUpdateComponent, BoiteDeleteDialogComponent],
})
export class BoiteModule {}
