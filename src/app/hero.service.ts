import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Conetent-Type': 'application/json'})
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
    ) { }
  
  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched heroes');
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetached heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    // const hero = HEROES.find(h=>h.id === id)!;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched single hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addhero'))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );

  }

  searchHeros(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero aray.
      return of([]);
    }
    
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length?
        this.log(`found heroes matching "${term}"`):
        this.log(`no heroes match "${term}"`),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
        )
    );

  }
  private handleError<T>(operation='peration', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  } 
  private log(message: string) {
    this.messageService.add(`HeroService from internal log call: ${message}`);
  }
}
