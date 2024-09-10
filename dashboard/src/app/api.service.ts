import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getClients(): Observable<any> {
    return this.http.get(this.clientsUrl);
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


}
