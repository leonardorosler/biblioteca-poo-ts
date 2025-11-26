import { Membro } from '../classes/Membro';
import * as fs from 'fs';
import * as path from 'path';
import { DAO } from '../DAO/DAO';


export class GerenciadorMembros implements DAO<Membro, number> {
    private membros: Membro[] = [];
    private proximoId: number = 1;
    private arquivoMembros: string = path.join(__dirname, '../data/membros.json');

  
    constructor() {
        this.carregar();
    }

    public criarMembro(membro: Membro): void {
        if (this.encontrarPorMatricula(membro.numeroMatricula)) {
            throw new Error("Já existe um membro com esta matrícula");
        }
        this.membros.push(membro);
        this.salvar();
    }

 
    public obterMembros(): Membro[] {
        return [...this.membros];
    }

    public obterMembrosAtivos(): Membro[] {
        return this.membros.filter(membro => membro.ativo);
    }

    public encontrarPorId(id: number): Membro | undefined {
        return this.membros.find(membro => membro.id === id);
    }

    public encontrarPorMatricula(matricula: string): Membro | undefined {
        return this.membros.find(membro => membro.numeroMatricula === matricula);
    }

    public encontrarPorNome(nome: string): Membro[] {
        const termo = nome.toLowerCase();
        return this.membros.filter(membro =>
            membro.nome.toLowerCase().includes(termo)
        );
    }

    public atualizarMembro(id: number, dadosAtualizados: Partial<Membro>): void {
        const membro = this.encontrarPorId(id);
        if (!membro) {
            throw new Error("Membro não encontrado");
        }

        if (dadosAtualizados.nome) membro.nome = dadosAtualizados.nome;
        if (dadosAtualizados.endereco) membro.endereco = dadosAtualizados.endereco;
        if (dadosAtualizados.telefone) membro.telefone = dadosAtualizados.telefone;
        if (dadosAtualizados.numeroMatricula) membro.numeroMatricula = dadosAtualizados.numeroMatricula;

        this.salvar();
    }

    public removerMembro(id: number): void {
        const index = this.membros.findIndex(membro => membro.id === id);
        if (index === -1) {
            throw new Error("Membro não encontrado");
        }

        this.membros.splice(index, 1);
        this.salvar();
    }

  
    public gerarId(): number {
        return this.proximoId++;
    }

    private salvar(): void {
        const dados = this.membros.map(membro => membro.toJSON());
        const dadosComProximoId = {
            proximoId: this.proximoId,
            membros: dados
        };
        fs.writeFileSync(this.arquivoMembros, JSON.stringify(dadosComProximoId, null, 2));
    }

 
    private carregar(): void {
        try {
            if (fs.existsSync(this.arquivoMembros)) {
                const dados = JSON.parse(fs.readFileSync(this.arquivoMembros, 'utf-8'));
                this.membros = dados.membros.map((dado: any) => Membro.fromJSON(dado));
                this.proximoId = dados.proximoId || this.membros.length + 1;
            }
        } catch (error) {
            console.log("Arquivo de membros não encontrado. Iniciando com lista vazia.");
            this.proximoId = 1;
        }
    }

    // Implementação do contrato DAO<Membro, number>
    public criar(item: Membro): void {
        this.criarMembro(item);
    }

    public listar(): Membro[] {
        return this.obterMembros();
    }

    public buscarPorId(id: number): Membro | undefined {
        return this.encontrarPorId(id);
    }

    public atualizar(id: number, dadosAtualizados: Partial<Membro>): void {
        this.atualizarMembro(id, dadosAtualizados);
    }

    public remover(id: number): void {
        this.removerMembro(id);
    }
}
