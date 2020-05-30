import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../interfaces/hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$ : Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  constructor(private heroService : HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(

      // wait 3000 ms after each keystroke
      debounceTime(300),

      //  ensures that a request is sent only if the filter text changed
      distinctUntilChanged(),

      // switch to new observable each time search term changes
      // calls the search service for each search term that makes it through debounce() 
      // and distinctUntilChanged(). It cancels and discards previous search observables, 
      // returning only the latest search service observable
      switchMap((term: string) => this.heroService.serchHeroes(term))

    );
  }

  search(term: string) : void {
    this.searchTerms.next(term);
  }

}
