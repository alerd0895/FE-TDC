import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private myAppURL = 'https://localhost:44340/';
  private myAPIURL = 'api/Tarjeta/';
  constructor(private http: HttpClient) { }

  getListTarjetas() : Observable<any>{
    return this.http.get(this.myAppURL + this.myAPIURL);
  }

  deleteTarjeta(id: number): Observable<any>{
    return this.http.delete(this.myAppURL + this.myAPIURL + id);
  }

  saveTarjeta(tarjeta: any): Observable<any>{
      return this.http.post(this.myAppURL + this.myAPIURL, tarjeta);
  }

  updateTarjeta(id: number, tarjeta: any): Observable<any>{
    return this.http.put(this.myAppURL + this.myAPIURL + id, tarjeta);
  }
}
