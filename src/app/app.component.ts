import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-root',
  template: '<app-upload></app-upload>',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadComponent],
})
export class AppComponent {}
