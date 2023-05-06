import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() SelectedFeatureEvent= new EventEmitter<string>();
  
  onSelected(selectedEvent: string){
    this.SelectedFeatureEvent.emit(selectedEvent);
  }
}
