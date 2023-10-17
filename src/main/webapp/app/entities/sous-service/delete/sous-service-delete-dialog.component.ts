import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISousService } from '../sous-service.model';
import { SousServiceService } from '../service/sous-service.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sous-service-delete-dialog.component.html',
})
export class SousServiceDeleteDialogComponent {
  sousService?: ISousService;

  constructor(protected sousServiceService: SousServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sousServiceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
