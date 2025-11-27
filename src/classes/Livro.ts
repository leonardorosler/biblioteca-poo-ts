export class Livro {
    private _isbn: string;
    private _titulo: string;
    private _autor: string;
    private _anoPublicacao: number;
    private _disponivel: boolean;

    constructor(isbn: string, titulo: string, autor: string, anoPublicacao: number) {
        this._isbn = isbn;
        this._titulo = titulo;
        this._autor = autor;
        this._anoPublicacao = anoPublicacao;
        this._disponivel = true;
    }


    // getters (leitura)
    public get isbn(): string {
        return this._isbn;
    }

    public get titulo(): string {
        return this._titulo;
    }

    public get autor(): string {
        return this._autor;
    }

    public get anoPublicacao(): number {
        return this._anoPublicacao;
    }

    public get disponivel(): boolean {
        return this._disponivel;
    }

    // setters (validação simples)
    public set titulo(titulo: string) {
        if (titulo.length < 1) {
            throw new Error("Título não pode ser vazio");
        }
        this._titulo = titulo;
    }

    public set autor(autor: string) {
        if (autor.length < 2) {
            throw new Error("Autor deve ter pelo menos 2 caracteres");
        }
        this._autor = autor;
    }

    public set anoPublicacao(ano: number) {
        if (ano < 0 || ano > 2025) {
            throw new Error(`Ano de publicação invalido`);
        }
        this._anoPublicacao = ano;
    }

    // métodos de negócio: emprestar / devolver
    public emprestar(): void {
        if (!this._disponivel) {
            throw new Error("Livro não está disponível para empréstimo");
        }
        this._disponivel = false;
    }

    public devolver(): void {
        this._disponivel = true;
    }

    // sobrescrita do método toString
    public toString(): string {
        return `"${this._titulo}" por ${this._autor} (${this._anoPublicacao}) - ${this._disponivel ? 'Disponível' : 'Emprestado'}`;
    }

    // toJSON/fromJSON - ajudando a gravar/ler JSON com instâncias
    public toJSON(): any {
        return {
            isbn: this._isbn,
            titulo: this._titulo,
            autor: this._autor,
            anoPublicacao: this._anoPublicacao,
            disponivel: this._disponivel
        };
    }

    // método estático para criar a partir de JSON
    public static fromJSON(json: any): Livro {
        const livro = new Livro(
            json.isbn,
            json.titulo,
            json.autor,
            json.anoPublicacao
        );
        livro._disponivel = json.disponivel;
        return livro;
    }
}
