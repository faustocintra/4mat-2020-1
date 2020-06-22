import { ClienteService } from './../../cliente/cliente.service';
import { VendaService } from './../venda.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';

@Component({
  selector: 'app-venda-form',
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.scss']
})
export class VendaFormComponent implements OnInit {

  title : string = 'Nova venda'

  venda : any = {} // Objeto vazio

  // Entidades relacionadas
  clientes : any = [] // Vetor vazio

  constructor(
    private snackBar: MatSnackBar,
    private vendaSrv: VendaService,
    private clienteSrv: ClienteService,
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
      // this.venda com esses dados
      try {
        this.venda = await this.vendaSrv.obterUm(params['id'])
      }
      catch(erro) {
        this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
      }
    }

    // Preenchendo entidades relacionadas
    try {
      this.clientes = await this.clienteSrv.listar()
    }
    catch(erro) {
      this.snackBar.open(erro.message, 'Que pena!', {duration: 5000})
    }

  }

  async salvar(form: NgForm) {
    // Qualquer tentativa de salvamento somente será feita se o formulário
    // for válido
    if(form.valid) {
      try {
        let msg = 'Venda criada com sucesso.'
        // Atualização: já existe o atributo _id
        if(this.venda._id) {
          await this.vendaSrv.atualizar(this.venda)
          msg = 'Venda atualizada com sucesso.'
        }
        else { // Novo venda (ainda não existe o campo _id)
          await this.vendaSrv.novo(this.venda)
        }
        this.snackBar.open(msg, 'Entendi', {duration: 5000})
        // Retornar à página de listagem
        this.router.navigate(['/venda'])
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
      this.router.navigate(['/venda']); // Retorna à listagem
    }

  }


}
