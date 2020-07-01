import { ProdutoService } from './../../produto/produto.service';
import { VendaService } from './../../venda/venda.service';
import { ItemVendaService } from './../item-venda.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDlgComponent } from 'src/app/ui/confirm-dlg/confirm-dlg.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-venda-form',
  templateUrl: './item-venda-form.component.html',
  styleUrls: ['./item-venda-form.component.scss']
})
export class ItemVendaFormComponent implements OnInit {

  title: string = 'Novo item de venda'

  vendaDisabled : boolean = false

  itemVenda: any = { desconto: 0, acrescimo: 0 } 

  // Entidades relacionadas
  vendas: any = [] // Vetor vazio
  produtos: any = []

  constructor(
    private snackBar: MatSnackBar,
    private itemVendaSrv: ItemVendaService,
    private vendaSrv: VendaService,
    private produtoSrv: ProdutoService,
    //private router: Router,
    private location: Location,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    // Capturando os eventuais parâmetros da rota pela qual
    // chegamos ao formulário
    let params = this.actRoute.snapshot.params;

    // Se existir um parâmetro chamado :id
    if (params['id']) {
      // É caso de atualização. Precisamos chamar o método obterUm() do
      // service para buscar o registro no back-end e preencher a variável
      // this.item-venda com esses dados
      try {
        this.itemVenda = await this.itemVendaSrv.obterUm(params['id'])
        this.title = 'Alterando item de venda'
      }
      catch (erro) {
        this.snackBar.open(erro.message, 'Que pena!', { duration: 5000 })
      }
    }

    // Se existir um parâmetro chamado :venda
    if(params['venda']) {
      // Iniciar o item de venda já com uma venda selecionada
      // O select da venda já virá com a venda correta selecionada
      this.itemVenda.venda = params['venda']
      // O select da venda passa a ser somente leitura
      this.vendaDisabled = true
    }

    // Preenchendo entidades relacionadas
    try {
      this.vendas = await this.vendaSrv.listar()
      this.produtos = await this.produtoSrv.listar()
    }
    catch (erro) {
      this.snackBar.open(erro.message, 'Que pena!', { duration: 5000 })
    }

  }

  async salvar(form: NgForm) {
    // Qualquer tentativa de salvamento somente será feita se o formulário
    // for válido
    if (form.valid) {
      try {
        let msg = 'Item de venda criado com sucesso.'
        // Atualização: já existe o atributo _id
        if (this.itemVenda._id) {
          await this.itemVendaSrv.atualizar(this.itemVenda)
          msg = 'Item de venda atualizado com sucesso.'
        }
        else { // Novo item-venda (ainda não existe o campo _id)
          await this.itemVendaSrv.novo(this.itemVenda)
        }
        this.snackBar.open(msg, 'Entendi', { duration: 5000 })
        // Retornar à página de listagem
        //this.router.navigate(['/item-venda'])
        this.location.back()
      }
      catch (erro) {
        this.snackBar.open(erro.message, 'Que pena!', { duration: 5000 })
      }
    }
  }

  async voltar(form: NgForm) {

    let result = true;
    console.log(form);
    // form.dirty = formulário "sujo", não salvo (via código)
    // form.touched = o conteúdo de algum campo foi alterado (via usuário)
    if (form.dirty && form.touched) {
      let dialogRef = this.dialog.open(ConfirmDlgComponent, {
        width: '50%',
        data: { question: 'Há dados não salvos. Deseja realmente voltar?' }
      });

      result = await dialogRef.afterClosed().toPromise();

    }

    if (result) {
      //this.router.navigate(['/item-venda']); // Retorna à listagem
      this.location.back()
    }

  }
 
}
