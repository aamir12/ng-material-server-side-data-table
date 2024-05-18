export interface FetchResponse<T> {
  items: T[];
  total_count: number;
}



export interface Style {
  [key: string]: string;
}

export interface IColumn {
  name: string;
  disableSorting?: boolean;
  displayName: string;
  headerStyle?: Style;
  dataStyle?: Style;
  transForm?: (value: any) => any;
  headerClasses?: string[];
  dataClasses?: string[];
}

export interface IActionBtn<T> {
  name: string;
  onClick: (data: T) => void;
  icon?: string;
  access?: (data: T) => boolean;
}

export interface IActionBtnConfiguration<T> {
  positions: 'start' | 'end';
  headerStyle?: Style;
  dataStyle?: Style;
  headerClasses?: string[];
  dataClasses?: string[];
  classes?: string[];
  buttons: IActionBtn<T>[];
  sticky?:boolean;
}

export interface SearchObject {
  [key:string]:unknown
}

export type NonArrayObject = object & { length?: never };

export interface TableMeta<T>  {
  numberofFilterRecords : string;
  currentPage: number;
  itemPerPage:number;
  sortBy: string;
  sortDirection: string;
  firstRenderedRecord : T;
  lastRenderedRecord: T;
  tableHeight: number;
  numberOfColumns: number;
  numberOfVisibleRows:number;
}