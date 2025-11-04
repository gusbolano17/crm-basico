import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria';
import { Environment } from '../core/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private http = inject(HttpClient);

  listarCategorias() : Observable<Categoria[]>{
    return this.http.get<Categoria[]>(`${Environment.API_URL}/categoria/listar`);
  }
  
}
