import { Component } from '@angular/core';
import { Contact } from './contacts/contact.model';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';
  selectedFeature = 'documents';

  switchView(selectedFeature: string){

    this.selectedFeature = selectedFeature;
  }

}
