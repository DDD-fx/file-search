import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { BehaviorSubject } from 'rxjs';

type AOA = any[][];

@Injectable({
  providedIn: 'root',
})
export class FileProcessingService {
  public data: any[] = [];

  public isNewFileUploaded$ = new BehaviorSubject<boolean>(false);

  processFile(files: ArrayBuffer) {
    const workBook: XLSX.WorkBook = XLSX.read(files, { type: 'binary' });
    const firstSheetName: string = workBook.SheetNames[0];
    const firstSheetData: XLSX.WorkSheet = workBook.Sheets[firstSheetName];

    const AOAData = <AOA>XLSX.utils.sheet_to_json(firstSheetData, { header: 1 });
    this.data = AOAData.flat();

    this.changeIsNewFileUploaded(true);
  }

  changeIsNewFileUploaded(value: boolean) {
    this.isNewFileUploaded$.next(value);
  }
}
