import { Membro } from '../classes/Membro';
import { Livro } from '../classes/Livro';
import { GerenciadorMembros } from '../services/GerenciadorMembros';
import { GerenciadorLivros } from '../services/GerenciadorLivros';
import { GerenciadorEmprestimos } from '../services/GerenciadorEmprestimos';

jest.mock('fs');

describe('GerenciadorEmprestimos (simplificado)', () => {
    let gm: GerenciadorMembros;
    let gl: GerenciadorLivros;
    let ge: GerenciadorEmprestimos;

    beforeEach(() => {
        gm = new GerenciadorMembros();
        gl = new GerenciadorLivros();
        ge = new GerenciadorEmprestimos(gm, gl);

        (gm as any).membros = [];
        (gm as any).proximoId = 1;
        (gl as any).livros = [];
        (ge as any).emprestimos = [];
        (ge as any).proximoId = 1;
    });

    test('realiza empréstimo básico', () => {
        const m = new Membro(1, 'João', 'Rua 1', '11111111', 'M001');
        const l = new Livro('123', 'Livro', 'Autor', 2000);
        gm.criarMembro(m);
        gl.criarLivro(l);
        const e = ge.criarEmprestimo(1, '123');
        expect(e).toBeDefined();
        expect(l.disponivel).toBe(false);
    });

    test('não permite empréstimo quando livro indisponível', () => {
        const m1 = new Membro(1, 'J', 'R', '111', 'M1');
        const m2 = new Membro(2, 'M', 'R2', '222', 'M2');
        const l = new Livro('X1', 'Title', 'Author', 2001);
        gm.criarMembro(m1);
        gm.criarMembro(m2);
        gl.criarLivro(l);
        ge.criarEmprestimo(1, 'X1');
        expect(() => ge.criarEmprestimo(2, 'X1')).toThrow();
    });

    test('não permite empréstimo para membro inativo', () => {
        const m = new Membro(1, 'J', 'R', '111', 'M1');
        const l = new Livro('Z9', 'Title', 'Author', 2002);
        gm.criarMembro(m);
        gl.criarLivro(l);
        m.desativar();
        expect(() => ge.criarEmprestimo(1, 'Z9')).toThrow();
    });
});
