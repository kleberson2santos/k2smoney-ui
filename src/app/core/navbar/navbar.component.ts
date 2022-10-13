import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./../../seguranca/auth.service";
import { ErrorHandlerService } from "./../error-handler.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  exibindoMenu: boolean = false;
  usuarioLogado: string = "";

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.auth.jwtPayload?.nome;
  }

  ngAfterViewInit() {
    this.clickLinksDoMenuEscondeMenu();
    this.clickForaDoMenuEscondeMenu();
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

  logout() {
    this.auth.logout();
  }

  private clickLinksDoMenuEscondeMenu(): void {
    const links = document.querySelectorAll(".navbar-menuitem a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        this.exibindoMenu = false;
      });
    });
  }

  private clickForaDoMenuEscondeMenu(): void {
    const menu = document.getElementsByClassName("navbar-menu")[0];
    const iconeMenu = document.getElementsByClassName("pi pi-bars")[0];

    window.addEventListener("click", (evt) => {
      const isNotMenuIcon = evt.target !== iconeMenu;
      const isNotMenuItem = !menu.contains(evt.target as any);

      if (isNotMenuIcon && isNotMenuItem) {
        this.exibindoMenu = false;
      }
    });
  }
}
