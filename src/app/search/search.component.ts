import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileProcessingService } from '../services/file-processing.service';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  public isSearchComplete = false;

  public resultFound = false;

  public searchFieldControl: FormControl = new FormControl(
    { value: '', disabled: true },
    Validators.minLength(3)
  );

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly fileProcessingService: FileProcessingService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.fileProcessingService.isNewFileUploaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isNewFileUploaded) => {
        if (isNewFileUploaded) {
          this.searchFieldControl.setValue('');
          this.searchFieldControl.enable();
          this.isSearchComplete = false;
        }
      });

    const MIN_LETTERS_FOR_SEARCH = 3;
    const DEBOUNCE_TIME = 700;

    combineLatest([this.searchFieldControl.valueChanges])
      .pipe(
        tap(() => (this.isSearchComplete = false)),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        filter(([searchField]) => searchField.length >= MIN_LETTERS_FOR_SEARCH),
        tap((searchField) =>
          this.findData(this.fileProcessingService.data, searchField[0].toLowerCase().trim())
        ),
        catchError((err) => {
          throw new Error(err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  findData(data: any[], searchFieldValue: string) {
    const result = data.find((item) => item.toString().toLowerCase().includes(searchFieldValue));
    this.resultFound = !!result;
    this.isSearchComplete = true;
    this.cdr.detectChanges();
  }
}
