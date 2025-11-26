import { Livro } from '../classes/Livro';
import * as fs from 'fs';
import * as path from 'path';
import { DAO } from '../DAO/DAO';


export class GerenciadorLivros implements DAO<Livro, string> {
    private livros: Livro[] = [];
    private arquivoLivros: string = path.join(__dirname, '../data/livros.json');


    public criar(item: Livro): void {
        this.criarLivro(item);
    }

    public listar(): Livro[] {
        return this.obterLivros();
    }

    public buscarPorId(isbn: string): Livro | undefined {
        return this.encontrarPorIsbn(isbn);
    }

    public atualizar(id: string, dadosAtualizados: Partial<Livro>): void {
        this.atualizarLivro(id, dadosAtualizados);
    }

    public remover(id: string): void {
        this.removerLivro(id);
    }

    constructor() {
        this.carregar();
    }

    public criarLivro(livro: Livro): void {
        if (this.encontrarPorIsbn(livro.isbn)) {
            throw new Error("Já existe um livro com este ISBN");
        }
        this.livros.push(livro);
        this.salvar();
    }

    public obterLivros(): Livro[] {
        return [...this.livros];
    }

    public obterLivrosDisponiveis(): Livro[] {
        return this.livros.filter(livro => livro.disponivel);
    }

    public encontrarPorIsbn(isbn: string): Livro | undefined {
        return this.livros.find(livro => livro.isbn === isbn);
    }

    public encontrarPorTitulo(titulo: string): Livro[] {
        const termo = titulo.toLowerCase();
        return this.livros.filter(livro =>
            livro.titulo.toLowerCase().includes(termo)
        );
    }


    public atualizarLivro(isbn: string, dadosAtualizados: Partial<Livro>): void {
        const livro = this.encontrarPorIsbn(isbn);
        if (!livro) {
            throw new Error("Livro não encontrado");
        }

        if (dadosAtualizados.titulo) livro.titulo = dadosAtualizados.titulo;
        if (dadosAtualizados.autor) livro.autor = dadosAtualizados.autor;
        if (dadosAtualizados.anoPublicacao) livro.anoPublicacao = dadosAtualizados.anoPublicacao;

        this.salvar();
    }

    public removerLivro(isbn: string): void {
        const index = this.livros.findIndex(livro => livro.isbn === isbn);
        if (index === -1) {
            throw new Error("Livro não encontrado");
        }

        const livro = this.livros[index];
        if (!livro.disponivel) {
            throw new Error("Não é possível remover um livro que está emprestado");
        }

        this.livros.splice(index, 1);
        this.salvar();
    }

    private salvar(): void {
        const dados = this.livros.map(livro => livro.toJSON());
        fs.writeFileSync(this.arquivoLivros, JSON.stringify(dados, null, 2));
    }

    private carregar(): void {
        try {
            if (fs.existsSync(this.arquivoLivros)) {
                const dados = JSON.parse(fs.readFileSync(this.arquivoLivros, 'utf-8'));
                this.livros = dados.map((dado: any) => Livro.fromJSON(dado));
            }
        } catch (error) {
            console.log("Arquivo de livros não encontrado. Iniciando com lista vazia.");
        }
    }
}
