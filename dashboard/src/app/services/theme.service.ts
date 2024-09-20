import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://3.128.249.166:8000/api/themes/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private http: HttpClient) {}

  // Método para obter todos os temas (GET)
  getThemes(): Observable<any> {
    return this.http.get(API_URL);
  }

  // Método para criar um novo tema (POST)
  createTheme(theme: { name: string; color: string; price: number; itens: number[] }): Observable<any> {
    return this.http.post(API_URL, theme, httpOptions);
  }
}
