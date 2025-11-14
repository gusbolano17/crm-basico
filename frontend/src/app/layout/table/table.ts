import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export type ActionsTable = {
  label: string;
  class: string;
  disabled?: (row: any) => boolean;
  callback: (row: any) => void;
};

export type ColumnType = {
  key: string;
  label: string;
  type: string;
  currency?: string;
};

@Component({
  selector: 'app-table',
  imports: [MatTableModule, NgClass, DatePipe, CurrencyPipe],
  templateUrl: './table.html',
})
export class Table<T> {
  public columns = input.required<ColumnType[]>();
  public datasource = input.required<MatTableDataSource<T>>();
  public actions = input<ActionsTable[]>([]);


  getValue(row: any, path: string) {
    return path.split('.').reduce((acc, p) => acc?.[p], row);
  }

  get columnsKeys() {
    return this.columns()?.map((c) => c.key) ?? [];
  }
}
