import { FornecedorService } from './../fornecedor.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.scss']
})
export class FornecedorFormComponent implements OnInit {

  title : string = 'Novo fornecedor'

  fornecedor : any = {} // Objeto vazio

  constructor(
    private snackBar: MatSnackBar,
    private fornecedorSrv: FornecedorService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    // Capturando os eventuais parâmetros da rota pela qual
    // chegamos ao formulário
    let params = this.actRoute.snapshot.params;
    
    // Se existir um parâmetro chamado :id
    if(params['id']) {
      // É caso de atualização. Precisamos chamar o método obterUm() do
      // service para buscar o registro no back-end e preencher a variável
      // this.fornecedor com esses dados
      try {
        this.fornecedor = await this.fornecedorSrv.obterUm(params['id'])
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }
  }

  async salvar(form: NgForm) {
    // Qualquer tentativa de salvamento somente será feita se o formulário
    // for válido
    if(form.valid) {
      try {
        let msg = 'Fornecedor criado com sucesso.'
        // Atualização: já existe o atributo _id
        if(this.fornecedor._id) {
          await this.fornecedorSrv.atualizar(this.fornecedor)
          msg = 'Fornecedor atualizado com sucesso.'
        }
        else { // Novo fornecedor (ainda não existe o campo _id)
          await this.fornecedorSrv.novo(this.fornecedor)
        }
        this.snackBar.open(msg, 'Entendi', {duration: 5000})
        // Retornar à página de listagem
        this.router.navigate(['/fornecedor'])
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }
  }

  async voltar(form: NgForm) {
    
    let result = true;
    console.log(form);
    // form.dirty = formulário "sujo", não salvo (via código)
    // form.touched = o conteúdo de algum campo foi alterado (via usuário)
    if(form.dirty && form.touched) {
      let dialogRef = this.dialog.open(ConfirmDlgComponent, {
        width: '50%',
        data: { question: 'Há dados não salvos. Deseja realmente voltar?' }
      });

      result = await dialogRef.afterClosed().toPromise();

    }

    if(result) {
      this.router.navigate(['/fornecedor']); // Retorna à listagem
    }

  }


}
