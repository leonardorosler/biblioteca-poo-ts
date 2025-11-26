import { Emprestimo } from '../classes/Emprestimo';
import { Membro } from '../classes/Membro';
import { Livro } from '../classes/Livro';
import { GerenciadorMembros } from './GerenciadorMembros';
import { GerenciadorLivros } from './GerenciadorLivros';
import { DAO } from '../DAO/DAO';
import * as fs from 'fs';
import * as path from 'path';


export class GerenciadorEmprestimos implements DAO<Emprestimo, number> {
    private emprestimos: Emprestimo[] = [];
    private proximoId: number = 1;
    private arquivoEmprestimos: string = path.join(__dirname, '../data/emprestimos.json');

    
    constructor(
        private gerenciadorMembros: GerenciadorMembros,
        private gerenciadorLivros: GerenciadorLivros
    ) {
        this.carregar();
    }


    public criarEmprestimo(membroId: number, livroIsbn: string): Emprestimo {
        const membro = this.gerenciadorMembros.encontrarPorId(membroId);
        if (!membro) {
            throw new Error("Membro não encontrado");
        }

        const livro = this.gerenciadorLivros.encontrarPorIsbn(livroIsbn);
        if (!livro) {
            throw new Error("Livro não encontrado");
        }

        const emprestimo = new Emprestimo(this.proximoId++, membro, livro);
        this.emprestimos.push(emprestimo);
        this.salvar();

        return emprestimo;
    }
    
    public criar(item: Emprestimo): void {
        this.criarEmprestimo(item.membro.id, item.livro.isbn);
    }

    public listar(): Emprestimo[] {
        return this.obterEmprestimos();
    }

    public buscarPorId(id: number): Emprestimo | undefined {
        return this.encontrarPorId(id);
    }

    public atualizar(id: number, dadosAtualizados: Partial<Emprestimo>): void {
        const emprestimo = this.encontrarPorId(id);
        if (!emprestimo) throw new Error('Empréstimo não encontrado');
        if ((dadosAtualizados as any).devolvido) {
            this.realizarDevolucao(id);
        }
    }

    public remover(id: number): void {
        const index = this.emprestimos.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Empréstimo não encontrado');
        this.emprestimos.splice(index, 1);
        this.salvar();
    }

    public obterEmprestimos(): Emprestimo[] {
        return [...this.emprestimos];
    }

    public obterEmprestimosAtivos(): Emprestimo[] {
        return this.emprestimos.filter(emprestimo => !emprestimo.devolvido);
    }

    public obterPorMembro(membroId: number): Emprestimo[] {
        return this.emprestimos.filter(emprestimo =>
            emprestimo.membro.id === membroId
        );
    }

    public encontrarPorId(id: number): Emprestimo | undefined {
        return this.emprestimos.find(emprestimo => emprestimo.id === id);
    }

    public realizarDevolucao(emprestimoId: number): void {
        const emprestimo = this.encontrarPorId(emprestimoId);
        if (!emprestimo) {
            throw new Error("Empréstimo não encontrado");
        }

        emprestimo.devolver();
        this.salvar();
    }

    public obterHistoricoMembro(membroId: number): Emprestimo[] {
        return this.emprestimos.filter(emprestimo =>
            emprestimo.membro.id === membroId
        );
    }

    private salvar(): void {
        const dados = {
            proximoId: this.proximoId,
            emprestimos: this.emprestimos.map(emprestimo => emprestimo.toJSON())
        };
        fs.writeFileSync(this.arquivoEmprestimos, JSON.stringify(dados, null, 2));
    }


    private carregar(): void {
        try {
            if (fs.existsSync(this.arquivoEmprestimos)) {
                const dados = JSON.parse(fs.readFileSync(this.arquivoEmprestimos, 'utf-8'));
                this.proximoId = dados.proximoId || 1;

                this.emprestimos = dados.emprestimos.map((dado: any) => {
                    const membro = this.gerenciadorMembros.encontrarPorId(dado.membroId);
                    const livro = this.gerenciadorLivros.encontrarPorIsbn(dado.livroIsbn);

                    if (!membro || !livro) {
                        return null;
                    }

                    const emprestimo = new Emprestimo(dado.id, membro, livro);
                    if (dado.devolvido) {
                        emprestimo.devolver();
                    }
                    return emprestimo;
                }).filter((emp: Emprestimo | null) => emp !== null) as Emprestimo[];
            }
        } catch (error) {
            console.log("Arquivo de empréstimos não encontrado. Iniciando com lista vazia.");
            this.proximoId = 1;
        }
    }
}
