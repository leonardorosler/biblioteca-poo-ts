
export abstract class Pessoa {
    private _id: number;
    private _nome: string;
    private _endereco: string;
    private _telefone: string;

    constructor(id: number, nome: string, endereco: string, telefone: string) {
        this._id = id;
        this._nome = nome;
        this._endereco = endereco;
        this._telefone = telefone;
    }

    // getters: só leitura (para apresentação no CLI)
    public get id(): number {
        return this._id;
    }

    public get nome(): string {
        return this._nome;
    }

    public get endereco(): string {
        return this._endereco;
    }

    public get telefone(): string {
        return this._telefone;
    }

    // setters com validação para evita dados inválidos
    public set nome(nome: string) {
        if (nome.length < 2) {
            throw new Error("O nome deve ter pelo menos duas letras");
        }
        this._nome = nome;
    }

    public set endereco(endereco: string) {
        if (endereco.length < 4) {
            throw new Error("O Endereço deve ter pelo menos 4 caracteres");
        }
        this._endereco = endereco;
    }

    public set telefone(telefone: string) {
        if (telefone.length < 8) {
            throw new Error("O telefone deve ter pelo menos 8 caracteres");
        }
        this._telefone = telefone;
    }

    //abstrato: cada subclasse mostra sua forma de exibir dados.
    public abstract toString(): string;
}
