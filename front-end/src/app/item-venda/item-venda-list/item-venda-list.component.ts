import { Component, OnInit, Input } from '@angular/core';
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

  @Input() venda : string = '';

  // Quais colunas serão exibidas na tabela e qual a ordem de exibição
  displayedColumns: any = ['venda', 'produto', 'fornecedor', 'quantidade', 'preco_unitario',
    'desconto', 'acrescimo', 'preco_total', 'editar', 'excluir']
  
  constructor(
    private itemVendaSrv: ItemVendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    try {
      if(this.venda != '') { // Foi passsado um parâmetro com o _id da venda
        this.itensVenda = await this.itemVendaSrv.filtrarVenda(this.venda)
      }
      else {
        this.itensVenda = await this.itemVendaSrv.listar()
      }
    }
    catch(erro) {
      this.snackBar.open('ERRO: ' + erro.message, 'Que pena!', {
        duration: 3000
      })
    }
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
        await this.itemVendaSrv.excluir(id)
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
