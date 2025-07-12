import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {ProductService, Produto} from '../../services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {of} from 'rxjs';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class Home implements OnInit {

  produtos: Produto[] = [];
  isAdmin: boolean = false;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.isAdmin = this.authService.isMaster();
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.productService.getProdutos().subscribe({
      next: (data) => {
        this.produtos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', {duration: 3000});
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  protected readonly of = of;
}
