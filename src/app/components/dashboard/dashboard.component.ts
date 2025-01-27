import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Appliance } from '../../models/appliance';
import { Observable, of } from 'rxjs';
import { ApplianceService } from '../../services/appliance.service';
import { AddApplianceComponent } from '../add-appliance/add-appliance.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatListModule, MatButtonModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatTableModule, CommonModule, MatPaginatorModule, MatPaginator, ReactiveFormsModule, MatInputModule, MatSnackBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements AfterViewInit {
  appliances$: Observable<Appliance[]> = of([]);
  appliance_array: Appliance[] = [];
  dataSource = new MatTableDataSource<Appliance>([]);
  displayedColumns: string[] = ['id', 'customer', 'product', 'status', 'actions'];  
  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private applianceService: ApplianceService, public dialog:MatDialog, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({
      name: [''],
      product: [''],
      status: [''], 
    });

    applianceService.getAppliances().subscribe(p => {
      this.appliance_array = p;
      this.dataSource.data = p;
    })
    this.appliances$ = applianceService.getAppliances();

    this.dataSource.filterPredicate = (data: Appliance, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const nameMatch = data.customer.toLowerCase().includes(searchTerms.name);
      const productMatch = data.product.toLowerCase().includes(searchTerms.product);
      const statusMatch = data.status.toLowerCase().includes(searchTerms.status);
      return nameMatch && productMatch && statusMatch;
    };

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    this.searchForm.valueChanges.subscribe((formValues) => {
      const filterValue = JSON.stringify({
        name: formValues.name?.toLowerCase() || '',
        product: formValues.product?.toLowerCase() || '',
        status: formValues.status?.toLowerCase() || '',
      });
      this.dataSource.filter = filterValue;
    });
  }

  openAddApplianceModal(): void {
    const dialogRef = this.dialog.open(AddApplianceComponent, {
      width: '400px',
      data: { customer: '', product: '', status: 'Disponível' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newAppliance = {
          id: `${this.dataSource.data.length + 1}`,
          customer: result.customer,
          product: result.product,
          status: result.status
        };

        this.applianceService.addAppliance(newAppliance).subscribe({
          next: (savedAppliance) => {
            this.dataSource.data = [...this.dataSource.data, savedAppliance];
            this.snackBar.open('Produto adicionado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error: (err) => {
            console.error('Erro ao salvar os dados', err);
            this.snackBar.open('Erro ao adicionar produto.', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
          
        });
        this.dataSource.data = [...this.dataSource.data, newAppliance];
      }
    });
  }

  deleteAppliance(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applianceService.deleteAppliance(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item => item.id !== id);
            console.log(`Appliance com ID ${id} deletado com sucesso!`);
            this.snackBar.open(`Produto com ID ${id} excluído com sucesso!`, 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error: (err) => {
            console.error(`Erro ao deletar o appliance com ID ${id}:`, err);
            this.snackBar.open('Erro ao excluir produto.', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          },
        });
      }
    });
  }

  editAppliance(appliance: Appliance): void {
    const dialogRef = this.dialog.open(AddApplianceComponent, {
      width: '400px',
      data: { ...appliance }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updtAppliance: Appliance = {
          id: appliance.id,
          customer: result.customer,
          product: result.product,
          status: result.status
        };
  
        this.applianceService.updateAppliance(appliance.id, updtAppliance).subscribe({
          next: (updated) => {
            const index = this.dataSource.data.findIndex(item => item.id === appliance.id);
            if (index !== -1) {
              this.dataSource.data[index] = updated;
              this.dataSource.data = [...this.dataSource.data];
            }
            this.snackBar.open('Produto editado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error: (err) => {
            console.error('Erro ao editar o produto:', err);
            this.snackBar.open('Erro ao editar produto.', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }

  onSearch($event: Event) {
    throw new Error('Method not implemented.');
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'disponível':
        return 'available';
      case 'indisponível':
        return 'unavailable';
      default:
        return '';
    }
  }


}
