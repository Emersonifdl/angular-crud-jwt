import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Token } from '../models/token';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private resource: string = 'auth';
  private tokenSubject: BehaviorSubject<Token>;
  public token: Observable<Token>;

  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<Token>(
      JSON.parse(localStorage.getItem('token') || '{}')
    );

    this.token = this.tokenSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${environment.apiURL}/${this.resource}/login`,
        { email, password },
        httpOptions
      )
      .pipe(
        map((token) => {
          localStorage.setItem('token', JSON.stringify(token));
          this.tokenSubject.next(token);
          return token;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next({});
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
