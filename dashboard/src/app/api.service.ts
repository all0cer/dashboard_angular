import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://3.128.249.166:8000/api/themes/';
  private clientsUrl = 'http://3.128.249.166:8000/api/clients/';
  private rentsUrl = 'http://3.128.249.166:8000/api/rents/';
  private itensUrl = 'http://3.128.249.166:8000/api/itens/';
  private addressUrl = 'http://3.128.249.166:8000/api/Address/';

  constructor(private http: HttpClient) {}

  getThemes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getClients(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.clientsUrl);
  }

  getRents(): Observable<any> {
    return this.http.get(this.rentsUrl);
  }

  getItens(): Observable<any> {
    return this.http.get(this.itensUrl);
  }

  getAddress(): Observable<any> {
    return this.http.get(this.addressUrl);
  }

  // Método para salvar cliente (POST)
  saveClients(cliente: Usuario): Observable<Usuario> {
    const httpHeaders: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<Usuario>(this.clientsUrl, cliente, { headers: httpHeaders });
  }

  updateClient(id: number, cliente: Usuario): Observable<Usuario> {
    const httpHeaders: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.put<Usuario>(`${this.clientsUrl}${id}/`, cliente, { headers: httpHeaders });
  }

  // Método para excluir cliente (DELETE)
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.clientsUrl}${id}/`);
  }
}
