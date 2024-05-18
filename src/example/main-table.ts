import { Component, inject } from '@angular/core';
import { LibMatTable } from './lib-mat-table/lib-mat-table';
import { DataSevice } from './data-service';
import { SortDirection } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-table',
  styleUrl: 'main-table.css',
  templateUrl: 'main-table.html',
  standalone: true,
  imports: [
    LibMatTable,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class TableExample {
  displayedColumns: string[] = ['name', 'username', 'email'];
  dataService = inject(DataSevice);
  fetchDataFn = this.fetchData.bind(this);
  filterString = '';
  fetchData(
    sort: string,
    order: SortDirection,
    page: number,
    itemPerPage: number,
    filter: string
  ) {
    return this.dataService.loadData(sort, order, page, itemPerPage, filter);
  }

  ngAfterViewInit() {}
}
