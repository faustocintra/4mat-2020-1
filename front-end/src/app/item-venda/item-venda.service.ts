import { environment as env } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ItemVendaService {

  // INJEÇÃO DE DEPENDÊNCIA: pedimos ao Angular
  // para INJETAR nos parâmetros do construtor
  // as DEPENDÊNCIAS de que precisamos em uma
  // determinada classe. Assim, não precisamos
  // instanciar manualmente essas dependências.
  constructor(private http: HttpClient) { }

  private apiUri : string = env.apiBaseUri + '/item-venda'

  listar() {
    return this.http.get(this.apiUri).toPromise()  
  }

  excluir(id: string) {
    return this.http.request('DELETE', this.apiUri, {body: {_id: id}}).toPromise()
  }

  novo(body: any) {
    return this.http.post(this.apiUri, body).toPromise()
  }

  atualizar(body: any) {
    return this.http.put(this.apiUri, body).toPromise()
  }

  obterUm(id: string) {
    return this.http.get(this.apiUri + '/' + id).toPromise()
  }

}
