import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DndDirective } from '../dnd.directive';
import { AsyncPipe, NgIf } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { FileProcessingService } from '../services/file-processing.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DndDirective, NgIf, SearchComponent, AsyncPipe],
})
export class UploadComponent {
  public isNewFileUploaded$ = this.fileProcessingService.isNewFileUploaded$;

  constructor(private readonly fileProcessingService: FileProcessingService) {}

  onFileDrop($event: FileList) {
    this.processFile($event);
  }

  onFileChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.processFile(target.files!);
  }

  processFile(fileList: FileList) {
    this.fileProcessingService.changeIsNewFileUploaded(false);
    if (fileList.length > 1) throw new Error('Можно загрузить только 1 файл');

    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target!.result as ArrayBuffer;
      this.fileProcessingService.processFile(arrayBuffer);
    };
    reader.readAsArrayBuffer(fileList[0]);
  }
}
