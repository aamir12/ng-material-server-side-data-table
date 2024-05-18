import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import {
  BehaviorSubject,
  merge,
  Observable,
  of as observableOf,
  Subject,
  takeUntil,
} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { FetchResponse } from './table.interface';

@Component({
  selector: 'table-http-example',
  styleUrl: 'table-http-example.css',
  templateUrl: 'table-http-example.html',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
  ],
})
export class TableHttpExample<T>
  implements AfterViewInit, OnDestroy, OnChanges
{
  @Input() displayedColumns: string[] = [];
  @Input() pageSizeOptions = [5, 10, 25, 50, 100];
  @Input() perPage: number = 10;
  @Input() filterString: string = '';
  @Input() fetchDataFn: (
    sort: string,
    order: SortDirection,
    page: number,
    itemPerPage: number,
    filter: string
  ) => Observable<FetchResponse<T>>;

  filterStringNotify = new BehaviorSubject<string>('');
  data: T[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  destory$ = new Subject<void>();
  ngAfterViewInit() {
    merge(this.filterStringNotify, this.sort.sortChange)
      .pipe(takeUntil(this.destory$))
      .subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.filterStringNotify)
      .pipe(
        startWith({}),
        switchMap((filterString) => {
          this.isLoadingResults = true;
          console.log(this.paginator);
          console.log(filterString);
          let searchText = typeof filterString === 'string' ? filterString : '';
          return this.fetchDataFn(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            searchText
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.total_count;
          return data.items;
        })
      )
      .pipe(takeUntil(this.destory$))
      .subscribe((data) => (this.data = data));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['filterString'] &&
      changes['filterString'].currentValue !==
        changes['filterString'].previousValue
    ) {
      this.filterStringNotify.next(this.filterString);
    }
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destory$.unsubscribe();
  }
}
