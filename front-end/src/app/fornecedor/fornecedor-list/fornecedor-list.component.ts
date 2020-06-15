import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../fornecedor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.scss']
})
export class FornecedorListComponent implements OnInit {

  fornecedores : any = []  // Vetor vazio

  // Quais colunas serão exibidas na tabela e qual a ordem de exibição
  displayedColumns: any = ['razao_social', 'nome_fantasia', 'email', 'telefone', 'editar', 'excluir']
  
  constructor(
    private fornecedorSrv: FornecedorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.fornecedores = await this.fornecedorSrv.listar()
    console.log(this.fornecedores)
  }
  
  async excluirItem(id : string) {
    const dialogRef = this.dialog.open(ConfirmDlgComponent, {
      width: '50%',
      data: {question: 'Deseja realmente excluir este professor?'}
    });

    let result = await dialogRef.afterClosed().toPromise();
    
    //if(confirm('Deseja realmente excluir este item?')) {
    if(result) {
    
      try {
        await this.fornecedorSrv.excluir(id)
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
