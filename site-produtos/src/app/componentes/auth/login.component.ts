import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

interface Usuario {

  nome: string;
  email: string;
  password: string;
  //perfil: 'master' | 'comum';
} //Aqui implementei o local storage para salvar os dados do usuário para acesso.

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class Login implements OnInit {
  errorMessage: string = '';

  username: string = '';
  password: string = '';

  ngOnInit(): void {


    this.setUpForm();
    //this.inicializarUsuariosPadrao();
    //O OnInit constroi tudo em tempo de criação/execução. Tenho que ver direitinho no curso do Ralf Lima para ter certeza.
  }

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,) {
  }

  form!: FormGroup;
  isLoginMode: boolean = true; // Deixei ele como verdadeiro pois ele inicia na tela de login e não de cadastro.

  setUpForm(): void {
    this.form = this.formBuilder.group({
      nome: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    }) //Aqui validei os dados do formulário no formato que eu queria.
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode; //Aqui só testei se está na tela de login, se não tá vai para o cadastro.
  }

  getUsuarios(): Usuario[] {
    const dados = localStorage.getItem('usuarios'); //Aqui ele busca os item dos usuários
    return dados ? JSON.parse(dados) : []; // Aqui testo se tiver dados no localStorage se sim, ele retornara esses dados.
  }

  salvarUsuarios(lista: Usuario[]): void {
    localStorage.setItem('usuarios', JSON.stringify(lista)); //Quando o usuário não tem cadastro ele salva no localStorage como uma lista com os dados do usuário.
  }

  // Adiciona os usuários padrões se ainda não existirem no sistema
  /*inicializarUsuariosPadrao(): void {
    const usuarios = this.getUsuarios();
    const jaExiste = usuarios.some(u => u.email === 'master' || u.email === 'usuario');
    if (!jaExiste) {
      usuarios.push(
        { nome: 'Master', email: 'master', password: '7896', /*perfil: 'master' },
        { nome: 'Usuário Comum', email: 'usuario', password: '1234', /*perfil: 'comum' }
      );
      this.salvarUsuarios(usuarios);
    }
  }*/

  onSubmit() {
    this.authService.login(this.form.value.email, this.form.value.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }

  // //Aqui aplicarei a logica de salvar o usuário que vem do formulário, pois ele verifica no banco se já existe o usuário.
  // onSubmit(): void {
  //   console.log("Formulário enviado com sucesso!");
  //   if(this.form.invalid){
  //     console.log('Preencha todos os campos do formulário corretamente.', this.form.errors);
  //     return;
  //   }
  //   //console.log('Form invalido.', this.form.errors);
  //
  //   const {nome, email, password} = this.form.value; //Aqui eu tô setando os valores digitados no fomulário.
  //   const usuarios = this.getUsuarios(); // Só para lembrar que o push pega o usuário daqui.
  //
  //   if(this.isLoginMode){
  //     const usuario = usuarios.find(u => u.email === email && u.password === password); //Aqui tô buscando se os dados estão corretos de entrada no localStorage
  //     if(usuario){
  //       console.log('Login efetuado com sucesso!', usuario); //Login deu tudo certo, segue abaixo...
  //       localStorage.setItem('Usuário logado.', JSON.stringify(usuario)); //Aqui tô setando o item das variáveis para localStorage.
  //       this.router.navigate(['/home']); //Direciona a rota para home caso o usuário tenha logado com sucesso.
  //     }else {
  //       alert('Dados de entrada inválidos!'); //Toda lógica fiz para página de cadastro.
  //     }
  //   }else{
  //     const usuarioJaExiste = usuarios.some(u => u.email === email);
  //     if(usuarioJaExiste){
  //       alert('E-mail já cadastrado anteriormente.');
  //       return;
  //     }
  //     const novoUsuario : Usuario = {nome, email, password, /*perfil: 'comum'*/};
  //     usuarios.push(novoUsuario);
  //     this.salvarUsuarios(usuarios);
  //     alert('Cadastro efetuado com sucesso!');
  //     this.toggleMode();
  //     this.form.reset();
  //   }
  // }
}
