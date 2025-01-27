import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-appliance',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule],
  templateUrl: './add-appliance.component.html',
  styleUrls: ['./add-appliance.component.scss']
})
export class AddApplianceComponent {
  constructor(
    public dialogRef: MatDialogRef<AddApplianceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: string; product: string; status: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

