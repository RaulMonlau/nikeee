import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() searchEvent = new EventEmitter<string>();

  searchQuery: string = '';

  onSearch(): void {
    this.searchEvent.emit(this.searchQuery);
  }
}