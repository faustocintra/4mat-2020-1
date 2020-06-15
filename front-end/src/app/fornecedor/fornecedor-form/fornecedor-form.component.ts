import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.scss']
})
export class FornecedorFormComponent implements OnInit {

  title : string = 'Novo fornecedor'

  fornecedor : any = {} // Objeto vazio

  constructor() { }

  ngOnInit(): void {
  }

}
