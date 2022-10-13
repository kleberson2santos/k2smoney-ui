import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";

import { ActivatedRoute, Router } from "@angular/router";

import { MessageService } from "primeng/api";

import { ErrorHandlerService } from "src/app/core/error-handler.service";
import { LancamentoService } from "../lancamento.service";
import { LancamentoCielo } from "./../../core/model";

@Component({
  selector: "app-lancamento-cadastro",
  templateUrl: "./lancamento-cadastro.component.html",
  styleUrls: ["./lancamento-cadastro.component.css"],
})
export class LancamentoCadastroComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configurarFormulario();

    const codigoLancamento = this.route.snapshot.params["id"];

    this.title.setTitle("Novo lançamento Cielo");

    if (codigoLancamento && codigoLancamento !== "novo") {
      this.carregarLancamento(codigoLancamento);
    }
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      id: [],
      date: [null, Validators.required],
      cardBrand: [
        null,
        [
          this.validarObrigatoriedade,
          this.validarTamanhoMinimo(3),
          this.validarTamanhoMaximo(20),
        ],
      ],
      paymentType: [
        null,
        [
          this.validarObrigatoriedade,
          this.validarTamanhoMinimo(3),
          this.validarTamanhoMaximo(20),
        ],
      ],
      grossAmount: [null, [this.validarObrigatoriedade]],
      channel: [
        null,
        [
          this.validarObrigatoriedade,
          this.validarTamanhoMaximo(25),
          this.validarTamanhoMinimo(3),
        ],
      ],
      status: [
        null,
        [
          this.validarObrigatoriedade,
          this.validarTamanhoMinimo(5),
          this.validarTamanhoMaximo(20),
        ],
      ],
      netAmount: [null, [this.validarObrigatoriedade]],
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return input.value ? null : { obrigatoriedade: true };
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return !input.value || input.value.length >= valor
        ? null
        : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  validarTamanhoMaximo(valor: number) {
    return (input: FormControl) => {
      return !input.value || input.value.length <= valor
        ? null
        : { tamanhoMaximo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get("id")?.value);
  }

  carregarLancamento(id: number) {
    this.lancamentoService.buscarPorId(id).then(
      (lancamento) => {
        this.formulario.patchValue(lancamento);
        this.atualizarTituloEdicao();
      },
      (erro) => this.errorHandler.handle(erro)
    );
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {
    this.lancamentoService
      .adicionar(this.formulario.value)
      .then((lancamentoAdicionado) => {
        this.messageService.add({
          severity: "success",
          detail: "Lançamento adicionado com sucesso!",
        });

        this.router.navigate(["/cielo", lancamentoAdicionado.id]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService
      .atualizar(this.formulario.value)
      .then((lancamento: LancamentoCielo) => {
        this.formulario.patchValue(lancamento);
        this.messageService.add({
          severity: "success",
          detail: "Lançamento Cielo alterado com sucesso!",
        });
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();
    this.formulario.patchValue(new LancamentoCielo());
    this.router.navigate(["cielo/novo"]);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(
      `Edição de lançamento: ${this.formulario.get("id")?.value}`
    );
  }
}
