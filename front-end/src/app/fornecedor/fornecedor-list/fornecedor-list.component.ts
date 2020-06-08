import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../fornecedor.service';

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.scss']
})
export class FornecedorListComponent implements OnInit {

  fornecedores : any = []  // Vetor vazio
  
  constructor(private fornecedorSrv: FornecedorService) { }

  async ngOnInit() {
    this.fornecedores = await this.fornecedorSrv.listar()
    console.log(this.fornecedores)
  }

}
