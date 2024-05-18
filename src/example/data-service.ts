import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable, map } from 'rxjs';
import { FetchResponse } from './lib-mat-table/table.interface';
import { User } from './data.interface';

@Injectable({
  providedIn: 'root',
})
export class DataSevice {
  _httpClient = inject(HttpClient);

  loadData(
    sort: string,
    order: SortDirection,
    page: number,
    itemPerPage: number,
    filter: string
  ): Observable<FetchResponse<User>> {
    const requestUrl = `https://jsonplaceholder.typicode.com/users?_limit=${itemPerPage}&_page=${
      page + 1
    }&_sort=${sort}&_order=${order}&q=${filter}`;

    return this._httpClient
      .get<User[]>(requestUrl, { observe: 'response' })
      .pipe(
        map((res) => {
          let total_count = 0;
          const totalCountHeader = res.headers.get('X-Total-Count');
          if (totalCountHeader) {
            total_count = parseInt(totalCountHeader, 10) || 0;
          }

          const items: User[] = res.body || [];

          return {
            total_count,
            items,
          };
        })
      );
  }
}
