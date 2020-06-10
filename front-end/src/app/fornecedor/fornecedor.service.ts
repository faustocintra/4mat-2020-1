import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  // INJEÇÃO DE DEPENDÊNCIA: pedimos ao Angular
  // para INJETAR nos parâmetros do construtor
  // as DEPENDÊNCIAS de que precisamos em uma
  // determinada classe. Assim, não precisamos
  // instanciar manualmente essas dependências.
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get('http://localhost:3000/fornecedor').toPromise()  
  }

  excluir(id: string) {
    return this.http.request('DELETE', 'http://localhost:3000/fornecedor', {body: {_id: id}}).toPromise()
  }

}
