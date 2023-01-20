import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FileProcessingService } from '../services/file-processing.service';
import { AsyncPipe } from '@angular/common';

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
  ],
})
export class SearchComponent {
  public isFileReady$ = this.fileProcessingService.isFileReady$;

  public searchFieldControl: FormControl = new FormControl('');

  constructor(private readonly fileProcessingService: FileProcessingService) {}
}
