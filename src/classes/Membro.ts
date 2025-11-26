import { Pessoa } from './Pessoa';


export class Membro extends Pessoa {
    private _numeroMatricula: string;
    private _dataRegistro: Date;
    private _ativo: boolean;
    
    constructor(
        id: number,
        nome: string,
        endereco: string,
        telefone: string,
        numeroMatricula: string
    ) {
        super(id, nome, endereco, telefone);
        this._numeroMatricula = numeroMatricula;
        this._dataRegistro = new Date();
        this._ativo = true;
    }

    // getters (leitura simples)
    public get numeroMatricula(): string {
        return this._numeroMatricula;
    }

    public get dataRegistro(): Date {
        return this._dataRegistro;
    }

    public get ativo(): boolean {
        return this._ativo;
    }

    // setters (validação simples)
    public set numeroMatricula(numero: string) {
        if (numero.length < 3) {
            throw new Error("Número de matrícula inválido");
        }
        this._numeroMatricula = numero;
    }

    // métodos de domínio (ativar/desativar)
    public ativar(): void {
        this._ativo = true;
    }

    public desativar(): void {
        this._ativo = false;
    }

    // toString - polimorfismo (mostra o Membro de forma legível)
    public toString(): string {
        return `Membro: ${this.nome} (Matrícula: ${this._numeroMatricula}) - ${this._ativo ? 'Ativo' : 'Inativo'}`;
    }

    // toJSON para persistência
    public toJSON(): any {
        return {
            id: this.id,
            nome: this.nome,
            endereco: this.endereco,
            telefone: this.telefone,
            numeroMatricula: this._numeroMatricula,
            dataRegistro: this._dataRegistro.toISOString(),
            ativo: this._ativo
        };
    }

    // fromJSON para re-hidratar a instância (preserva métodos)
    public static fromJSON(json: any): Membro {
        const membro = new Membro(
            json.id,
            json.nome,
            json.endereco,
            json.telefone,
            json.numeroMatricula
        );
        membro._dataRegistro = new Date(json.dataRegistro);
        membro._ativo = json.ativo;
        return membro;
    }
}
