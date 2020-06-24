import { Component, OnInit } from '@angular/core';
import { ItemVendaService } from '../item-venda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-item-venda-list',
  templateUrl: './item-venda-list.component.html',
  styleUrls: ['./item-venda-list.component.scss']
})
export class ItemVendaListComponent implements OnInit {

  itensVenda : any = []  // Vetor vazio

  // Quais colunas serão exibidas na tabela e qual a ordem de exibição
  displayedColumns: any = ['venda', 'produto', 'quantidade', 'preco_unitario',
    'desconto', 'acrescimo', 'preco_total', 'editar', 'excluir']
  
  constructor(
    private item_vendaSrv: ItemVendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.itensVenda = await this.item_vendaSrv.listar()
    console.log(this.itensVenda)
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
        await this.item_vendaSrv.excluir(id)
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
