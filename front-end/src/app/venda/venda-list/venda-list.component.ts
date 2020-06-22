import { Component, OnInit } from '@angular/core';
import { VendaService } from '../venda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-venda-list',
  templateUrl: './venda-list.component.html',
  styleUrls: ['./venda-list.component.scss']
})
export class VendaListComponent implements OnInit {

  vendas : any = []  // Vetor vazio

  // Quais colunas serão exibidas na tabela e qual a ordem de exibição
  displayedColumns: any = ['num_venda', 'cliente', 'data_venda', 'forma_pagamento', 'data_pagamento', 'editar', 'excluir']
  
  constructor(
    private vendaSrv: VendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.vendas = await this.vendaSrv.listar()
    console.log(this.vendas)
  }
  
  async excluirItem(id : string) {
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '50%',
      data: {question: 'Deseja realmente excluir este item?'}
    });

    let result = await dialogRef.afterClosed().toPromise();
    
    //if(confirm('Deseja realmente excluir este item?')) {
    if(result) {
    
      try {
        await this.vendaSrv.excluir(id)
        // Chama o ngOnInit() novamente para atualizar os dados da tabela
        this.ngOnInit()
        this.snackBar.open('Item excluído com sucesso.', 'Entendi', {
          duration: 3000
        })
      }
      catch(erro) {
        alert('ERRO: não foi possível excluir o item.')
      }
    }
  }

}
