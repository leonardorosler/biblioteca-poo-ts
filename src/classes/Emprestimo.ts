import { Membro } from './Membro';
import { Livro } from './Livro';

export class Emprestimo {
    private _id: number;
    private _membro: Membro;
    private _livro: Livro;
    private _dataEmprestimo: Date;
    private _dataDevolucao: Date | null;
    private _devolvido: boolean;

    constructor(id: number, membro: Membro, livro: Livro) {
        if (!livro.disponivel) {
            throw new Error("Livro não está disponível para empréstimo");
        }
        if (!membro.ativo) {
            throw new Error("Membro não está ativo");
        }

        this._id = id;
        this._membro = membro;
        this._livro = livro;
        this._dataEmprestimo = new Date();
        this._dataDevolucao = null;
        this._devolvido = false;

        livro.emprestar();
    }

    // getters
    public get id(): number {
        return this._id;
    }

    public get membro(): Membro {
        return this._membro;
    }

    public get livro(): Livro {
        return this._livro;
    }

    public get dataEmprestimo(): Date {
        return this._dataEmprestimo;
    }

    public get dataDevolucao(): Date | null {
        return this._dataDevolucao;
    }

    public get devolvido(): boolean {
        return this._devolvido;
    }

    // métodos de negócio
    public devolver(): void {
        if (this._devolvido) {
            throw new Error("Empréstimo já foi devolvido");
        }

        this._dataDevolucao = new Date();
        this._devolvido = true;
        this._livro.devolver();
    }

    // para serialização em JSON
    public toJSON(): any {
        // serialização (persistência)
        return {
            id: this._id,
            membroId: this._membro.id,
            livroIsbn: this._livro.isbn,
            dataEmprestimo: this._dataEmprestimo.toISOString(),
            dataDevolucao: this._dataDevolucao ? this._dataDevolucao.toISOString() : null,
            devolvido: this._devolvido
        };
    }
}
