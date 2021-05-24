import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable,of } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { environment } from 'src/environments/environment';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})


export class DishService {
  myAppUrl!: string;
  myApiUrl!: string;
  myurl= 'https://localhost:44313';
  myapi='/api/dishes/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { 

      this.myAppUrl = environment.appUrl;
      this.myApiUrl = 'api/dishes/';
    }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL +'dishes' )
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));;
  }

  getFeaturedDish(): Observable< Dish> {
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));;
  }
  
  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
    .pipe(catchError(error => error));
  }

  putDish(dish: Dish): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Dish>(baseURL + 'dishes/' + dish.id, dish, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
    
}


