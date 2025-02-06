import { Component } from '@angular/core';
import { SearchService } from '../app/search.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private searchService: SearchService) {}
  title = 'online-retail';
  onSearch(searchTerm: string) {
    this.searchService.updateSearchTerm(searchTerm.trim());
  } 
}
