import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Lancamento, LancamentoCielo } from "../core/model";
import { environment } from "./../../environments/environment";

export class LancamentoFiltro {
  bandeira?: string;
  dataInicio?: Date;
  dataFim?: Date;
  pagina: number = 0;
  itensPorPagina: number = 25;
}

@Injectable({
  providedIn: "root",
})
export class LancamentoService {
  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos-cielo`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  uploadHeaders() {
    return new HttpHeaders().append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams()
      .set("page", filtro.pagina)
      .set("size", filtro.itensPorPagina);

    if (filtro.bandeira) {
      params = params.set("bandeira", filtro.bandeira);
    }

    if (filtro.dataInicio) {
      params = params.set("dataInicio", filtro.dataInicio.toISOString());
    }

    if (filtro.dataFim) {
      params = params.set("dataFim", filtro.dataFim.toISOString());
    }

    return this.http
      .get(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then((response: any) => {
        const lancamentos = response["content"];

        const resultado = {
          lancamentos,
          total: response["totalElements"],
        };

        return resultado;
      });
  }

  excluir(id: number): Promise<void> {
    return this.http.delete<void>(`${this.lancamentosUrl}/${id}`).toPromise();
  }

  adicionar(lancamento: LancamentoCielo): Promise<LancamentoCielo> {
    return this.http
      .post<LancamentoCielo>(this.lancamentosUrl, lancamento)
      .toPromise();
  }

  atualizar(lancamento: LancamentoCielo): Promise<LancamentoCielo> {
    return this.http
      .put<Lancamento>(`${this.lancamentosUrl}/${lancamento.id}`, lancamento)
      .toPromise()
      .then((response: any) => {
        this.converterStringsParaDatas([response]);

        return response;
      });
  }

  buscarPorId(id: number): Promise<Lancamento> {
    return this.http
      .get(`${this.lancamentosUrl}/${id}`)
      .toPromise()
      .then((response: any) => {
        this.converterStringsParaDatas([response]);

        return response;
      });
  }

  private converterStringsParaDatas(lancamentos: any[]) {
    for (const lancamento of lancamentos) {
      lancamento.date = new Date(lancamento.date);
    }
  }
}
