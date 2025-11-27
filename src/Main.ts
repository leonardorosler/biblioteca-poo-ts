import * as readline from 'readline';
import { GerenciadorLivros } from './services/GerenciadorLivros';
import { GerenciadorMembros } from './services/GerenciadorMembros';
import { GerenciadorEmprestimos } from './services/GerenciadorEmprestimos';
import { Livro } from './classes/Livro';
import { Membro } from './classes/Membro';


class BibliotecaCLI {
    private gerenciadorLivros: GerenciadorLivros;
    private gerenciadorMembros: GerenciadorMembros;
    private gerenciadorEmprestimos: GerenciadorEmprestimos;
    private rl: readline.Interface;

    constructor() {
        this.gerenciadorLivros = new GerenciadorLivros();
        this.gerenciadorMembros = new GerenciadorMembros();
        this.gerenciadorEmprestimos = new GerenciadorEmprestimos(
            this.gerenciadorMembros,
            this.gerenciadorLivros
        );
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Ponto de entrada para iniciar a interface CLI. Imprime cabeçalho e
     * exibe o menu principal.
     */
    public iniciar(): void {
        console.log('=== SISTEMA DE BIBLIOTECA ===\n');
        this.menuPrincipal();
    }

    // Menus (apenas UI) - aqui mostramos as opções ao usuário
    private menuPrincipal(): void {
        console.log('\n=== MENU PRINCIPAL ===');
        console.log('1. Gerenciar Livros');
        console.log('2. Gerenciar Membros');
        console.log('3. Gerenciar Empréstimos');
        console.log('4. Sair');

        this.rl.question('\nEscolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.menuLivros();
                    break;
                case '2':
                    this.menuMembros();
                    break;
                case '3':
                    this.menuEmprestimos();
                    break;
                case '4':
                    console.log('Saindo do sistema...');
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.menuPrincipal();
                    break;
            }
        });
    }

    private menuLivros(): void {
        console.log('\n=== GERENCIAR LIVROS ===');
        console.log('1. Adicionar Livro');
        console.log('2. Listar Livros');
        console.log('3. Buscar Livro');
        console.log('4. Atualizar Livro');
        console.log('5. Remover Livro');
        console.log('6. Voltar');

        this.rl.question('\nEscolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarLivro();
                    break;
                case '2':
                    this.listarLivros();
                    break;
                case '3':
                    this.buscarLivro();
                    break;
                case '4':
                    this.atualizarLivro();
                    break;
                case '5':
                    this.removerLivro();
                    break;
                case '6':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.menuLivros();
                    break;
            }
        });
    }

    private menuMembros(): void {
        console.log('\n=== GERENCIAR MEMBROS ===');
        console.log('1. Adicionar Membro');
        console.log('2. Listar Membros');
        console.log('3. Buscar Membro');
        console.log('4. Atualizar Membro');
        console.log('5. Remover Membro');
        console.log('6. Voltar');

        this.rl.question('\nEscolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarMembro();
                    break;
                case '2':
                    this.listarMembros();
                    break;
                case '3':
                    this.buscarMembro();
                    break;
                case '4':
                    this.atualizarMembro();
                    break;
                case '5':
                    this.removerMembro();
                    break;
                case '6':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.menuMembros();
                    break;
            }
        });
    }

    private menuEmprestimos(): void {
        console.log('\n=== GERENCIAR EMPRÉSTIMOS ===');
        console.log('1. Realizar Empréstimo');
        console.log('2. Listar Empréstimos Ativos');
        console.log('3. Listar Todos os Empréstimos');
        console.log('4. Devolver Livro');
        console.log('5. Histórico de Membro');
        console.log('6. Voltar');

        this.rl.question('\nEscolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.realizarEmprestimo();
                    break;
                case '2':
                    this.listarEmprestimosAtivos();
                    break;
                case '3':
                    this.listarTodosEmprestimos();
                    break;
                case '4':
                    this.devolverLivro();
                    break;
                case '5':
                    this.historicoMembro();
                    break;
                case '6':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida!');
                    this.menuEmprestimos();
                    break;
            }
        });
    }

    // Métodos para Livros (interações CLI) - criação e busca
    private adicionarLivro(): void {
        this.rl.question('ISBN: ', (isbn) => {
            this.rl.question('Título: ', (titulo) => {
                this.rl.question('Autor: ', (autor) => {
                    this.rl.question('Ano de Publicação: ', (ano) => {
                        try {
                            const livro = new Livro(isbn, titulo, autor, parseInt(ano));
                            this.gerenciadorLivros.criar(livro);
                            console.log('Livro adicionado com sucesso!');
                        } catch (error) {
                            console.log('Erro:', (error as Error).message);
                        }
                        this.menuLivros();
                    });
                });
            });
        });
    }

    private listarLivros(): void {
        const livros = this.gerenciadorLivros.listar();
        console.log('\n=== LIVROS CADASTRADOS ===');
        if (livros.length === 0) {
            console.log('Nenhum livro cadastrado.');
        } else {
            livros.forEach(livro => {
                console.log(livro.toString());
            });
        }
        this.menuLivros();
    }

    private buscarLivro(): void {
        this.rl.question('Digite o título ou ISBN: ', (termo) => {
            let resultados = this.gerenciadorLivros.encontrarPorTitulo(termo);
            if (resultados.length === 0) {
                const livro = this.gerenciadorLivros.buscarPorId(termo);
                if (livro) resultados = [livro];
            }

            console.log('\n=== RESULTADOS DA BUSCA ===');
            if (resultados.length === 0) {
                console.log('Nenhum livro encontrado.');
            } else {
                resultados.forEach(livro => console.log(livro.toString()));
            }
            this.menuLivros();
        });
    }

    private atualizarLivro(): void {
        this.rl.question('ISBN do livro a ser atualizado: ', (isbn) => {
            const livro = this.gerenciadorLivros.encontrarPorIsbn(isbn);
            if (!livro) {
                console.log('Livro não encontrado.');
                this.menuLivros();
                return;
            }

            this.rl.question(`Novo título (atual: ${livro.titulo}): `, (titulo) => {
                this.rl.question(`Novo autor (atual: ${livro.autor}): `, (autor) => {
                    this.rl.question(`Novo ano (atual: ${livro.anoPublicacao}): `, (ano) => {
                        try {
                            const dados: any = {};
                            if (titulo) dados.titulo = titulo;
                            if (autor) dados.autor = autor;
                            if (ano) dados.anoPublicacao = parseInt(ano);

                            this.gerenciadorLivros.atualizar(isbn, dados);
                            console.log('Livro atualizado com sucesso!');
                        } catch (error) {
                            console.log('Erro:', (error as Error).message);
                        }
                        this.menuLivros();
                    });
                });
            });
        });
    }

    private removerLivro(): void {
        this.rl.question('ISBN do livro a ser removido: ', (isbn) => {
            try {
                this.gerenciadorLivros.remover(isbn);
                console.log('Livro removido com sucesso!');
            } catch (error) {
                console.log('Erro:', (error as Error).message);
            }
            this.menuLivros();
        });
    }

    // Métodos para Membros (interações CLI) - criação e busca
    private adicionarMembro(): void {
        const id = this.gerenciadorMembros.gerarId();

        this.rl.question('Nome: ', (nome) => {
            this.rl.question('Endereço: ', (endereco) => {
                this.rl.question('Telefone: ', (telefone) => {
                    this.rl.question('Número de Matrícula: ', (matricula) => {
                        try {
                            const membro = new Membro(id, nome, endereco, telefone, matricula);
                            this.gerenciadorMembros.criar(membro);
                            console.log('Membro adicionado com sucesso!');
                        } catch (error) {
                            console.log('Erro:', (error as Error).message);
                        }
                        this.menuMembros();
                    });
                });
            });
        });
    }

    private listarMembros(): void {
        const membros = this.gerenciadorMembros.listar();
        console.log('\n=== MEMBROS CADASTRADOS ===');
        if (membros.length === 0) {
            console.log('Nenhum membro cadastrado.');
        } else {
            membros.forEach(membro => {
                console.log(membro.toString());
            });
        }
        this.menuMembros();
    }

    private buscarMembro(): void {
        this.rl.question('Digite o nome ou matrícula: ', (termo) => {
            let resultados = this.gerenciadorMembros.encontrarPorNome(termo);
            if (resultados.length === 0) {
                const membro = this.gerenciadorMembros.encontrarPorMatricula(termo);
                if (membro) resultados = [membro];
            }

            console.log('\n=== RESULTADOS DA BUSCA ===');
            if (resultados.length === 0) {
                console.log('Nenhum membro encontrado.');
            } else {
                resultados.forEach(membro => console.log(membro.toString()));
            }
            this.menuMembros();
        });
    }

    private atualizarMembro(): void {
        this.rl.question('ID do membro a ser atualizado: ', (idStr) => {
            const id = parseInt(idStr);
            const membro = this.gerenciadorMembros.buscarPorId(id);
            if (!membro) {
                console.log('Membro não encontrado.');
                this.menuMembros();
                return;
            }

            this.rl.question(`Novo nome (atual: ${membro.nome}): `, (nome) => {
                this.rl.question(`Novo endereço (atual: ${membro.endereco}): `, (endereco) => {
                    this.rl.question(`Novo telefone (atual: ${membro.telefone}): `, (telefone) => {
                        this.rl.question(`Nova matrícula (atual: ${membro.numeroMatricula}): `, (matricula) => {
                            try {
                                const dados: any = {};
                                if (nome) dados.nome = nome;
                                if (endereco) dados.endereco = endereco;
                                if (telefone) dados.telefone = telefone;
                                if (matricula) dados.numeroMatricula = matricula;

                                this.gerenciadorMembros.atualizar(id, dados);
                                console.log('Membro atualizado com sucesso!');
                            } catch (error) {
                                console.log('Erro:', (error as Error).message);
                            }
                            this.menuMembros();
                        });
                    });
                });
            });
        });
    }

    private removerMembro(): void {
        this.rl.question('ID do membro a ser removido: ', (idStr) => {
            try {
                this.gerenciadorMembros.remover(parseInt(idStr));
                console.log('Membro removido com sucesso!');
            } catch (error) {
                console.log('Erro:', (error as Error).message);
            }
            this.menuMembros();
        });
    }

    // Métodos para Empréstimos (interações CLI) - realizar/devolver/histórico
    private realizarEmprestimo(): void {
        this.rl.question('ID do Membro: ', (membroIdStr) => {
            this.rl.question('ISBN do Livro: ', (livroIsbn) => {
                try {
                    const emprestimo = this.gerenciadorEmprestimos.criarEmprestimo(
                        parseInt(membroIdStr),
                        livroIsbn
                    );
                    console.log('Empréstimo realizado com sucesso!');
                    console.log(`ID do Empréstimo: ${emprestimo.id}`);
                } catch (error) {
                    console.log('Erro:', (error as Error).message);
                }
                this.menuEmprestimos();
            });
        });
    }

    private listarEmprestimosAtivos(): void {
        const emprestimos = this.gerenciadorEmprestimos.obterEmprestimosAtivos();
        console.log('\n=== EMPRÉSTIMOS ATIVOS ===');
        if (emprestimos.length === 0) {
            console.log('Nenhum empréstimo ativo.');
        } else {
            emprestimos.forEach(emp => {
                console.log(`ID: ${emp.id} | Membro: ${emp.membro.nome} | Livro: ${emp.livro.titulo} | Data: ${emp.dataEmprestimo.toLocaleDateString()}`);
            });
        }
        this.menuEmprestimos();
    }

    private listarTodosEmprestimos(): void {
        const emprestimos = this.gerenciadorEmprestimos.listar();
        console.log('\n=== TODOS OS EMPRÉSTIMOS ===');
        if (emprestimos.length === 0) {
            console.log('Nenhum empréstimo registrado.');
        } else {
            emprestimos.forEach(emp => {
                const status = emp.devolvido ? 'Devolvido' : 'Ativo';
                console.log(`ID: ${emp.id} | Membro: ${emp.membro.nome} | Livro: ${emp.livro.titulo} | Status: ${status}`);
            });
        }
        this.menuEmprestimos();
    }

    private devolverLivro(): void {
        this.rl.question('ID do Empréstimo: ', (idStr) => {
            try {
                this.gerenciadorEmprestimos.realizarDevolucao(parseInt(idStr));
                console.log('Livro devolvido com sucesso!');
            } catch (error) {
                console.log('Erro:', (error as Error).message);
            }
            this.menuEmprestimos();
        });
    }

    private historicoMembro(): void {
        this.rl.question('ID do Membro: ', (idStr) => {
            const historico = this.gerenciadorEmprestimos.obterHistoricoMembro(parseInt(idStr));
            console.log('\n=== HISTÓRICO DO MEMBRO ===');
            if (historico.length === 0) {
                console.log('Nenhum empréstimo encontrado para este membro.');
            } else {
                historico.forEach(emp => {
                    const status = emp.devolvido ? 'Devolvido' : 'Ativo';
                    const dataDevolucao = emp.dataDevolucao ? emp.dataDevolucao.toLocaleDateString() : 'Não devolvido';
                    console.log(`Livro: ${emp.livro.titulo} | Empréstimo: ${emp.dataEmprestimo.toLocaleDateString()} | Devolução: ${dataDevolucao} | Status: ${status}`);
                });
            }
            this.menuEmprestimos();
        });
    }
}

// Inicializar a aplicação
const app = new BibliotecaCLI();
app.iniciar();
