/**
 * Title: confirm-dialog.component.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Shared module to warn users of irreversible actions
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DialogData } from '../models/dialog-data'

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent implements OnInit {
  dialogData: DialogData

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data
  }

  ngOnInit(): void {
  }

}
