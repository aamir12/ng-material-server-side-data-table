import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Inject,
  OnInit,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
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
import { CommonModule, DOCUMENT, DatePipe } from '@angular/common';
import { FetchResponse, IActionBtnConfiguration, IColumn } from './table.interface';
import { uniqueId } from '../utility.fn';
import { WINDOW } from '../window.service';

@Component({
  selector: 'lib-mat-table',
  styleUrl: 'lib-mat-table.css',
  templateUrl: 'lib-mat-table.html',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    DatePipe,
    CommonModule
  ],
})
export class LibMatTable<T>
  implements  OnDestroy, OnChanges,OnInit
{
  displayedColumns: string[] = [];
  @Input() pageSizeOptions = [5, 10, 25, 50, 100];
  @Input() pageSize: number = 10;
  @Input() filterString: string = '';
  @Input() containerClasses: string[] = [];
  @Input() tableContainerClasses: string[] = [];
  @Input() paginationClasses: string[] = [];
  @Input() limitSizes: number[] = [5, 10, 25, 50, 100];
  @Input() columns: IColumn[] = [];
  @Input() rowClickListner!: (data: T) => void;
  @Input() actionBtns: IActionBtnConfiguration<T> | undefined = undefined;
  @Input() noDataFoundLable: string = 'No Data Found.';
  @Input() sortActive: string = '';
  @Input() loadingLable: string = 'Loading...';
  @Input() sortDirection: 'asc' | 'desc' | '' = 'asc';
  tableContainerId = uniqueId();

  
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

  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  destory$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW private window: Window,
    ) {}

  ngOnInit(): void {
    this.setUpcolumnsSetting();
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


  setUpcolumnsSetting() {
    const displayedCols = this.columns.map((x) => x.name);
    if (!!this.actionBtns) {
      this.displayedColumns =
        this.actionBtns.positions === 'start'
          ? ['action', ...displayedCols]
          : [...displayedCols, 'action'];
    } else {
      this.displayedColumns = displayedCols;
    }
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


  isActionSticky(position:'start'|'end'):boolean {
    return   this.actionBtns?.positions === position && !!this.actionBtns?.sticky;
  }

  onRowClick(row: T) {
    if (this.rowClickListner) {
      this.rowClickListner(row);
    }
  }

  onOptionClick(event: Event) {
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destory$.unsubscribe();
  }
}
