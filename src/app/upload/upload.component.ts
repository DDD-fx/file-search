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
  public isFileReady$ = this.fileProcessingService.isFileReady$;

  constructor(private readonly fileProcessingService: FileProcessingService) {}

  onFileDropped($event: FileList) {
    this.fileProcessingService.changeFileReadyState(true);
    console.log($event);
    // this.prepareFilesList($event);
  }

  onFileChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files?.length !== 1) throw new Error('Можно загрузить только 1 файл');

    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target!.result as ArrayBuffer;
      this.fileProcessingService.processFile(arrayBuffer);
    };
    reader.readAsArrayBuffer(target.files[0]);
  }
}
