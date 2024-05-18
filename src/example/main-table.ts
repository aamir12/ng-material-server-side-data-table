import { Component, inject } from '@angular/core';
import { LibMatTable } from './lib-mat-table/lib-mat-table';
import { DataSevice } from './data-service';
import { SortDirection } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IActionBtnConfiguration, IColumn } from './lib-mat-table/table.interface';
import { User } from './data.interface';

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
  columns: IColumn[] = [
    {
      name: 'name',
      disableSorting: false,
      displayName: 'Name',
      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
    },
    {
      name: 'username',
      disableSorting: false,
      displayName: 'Username',
      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
      
    },
    {
      name: 'email',
      disableSorting: false,
      displayName: 'Email',
      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
    }
  ];

  actionBtns: IActionBtnConfiguration<User> = {
    positions: 'start',
    sticky:true,
    headerClasses: ['text-center', 'action-column'],
    dataClasses: ['text-center', 'action-column'],
    buttons: [
      {
        name: 'View',
        onClick: ()=>{}

      },
      {
        name: 'Edit',
        onClick: ()=>{}
      },
      {
        name: 'Delete',
        onClick: ()=>{},
      },
    ],
  };

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

  onRowClick() {}
}
