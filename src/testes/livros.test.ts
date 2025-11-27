import { Livro } from '../classes/Livro';
import { GerenciadorLivros } from '../services/GerenciadorLivros';


jest.mock('fs');

describe('GerenciadorLivros (simplificado)', () => {
    let gerenciador: GerenciadorLivros;

    beforeEach(() => {
        gerenciador = new GerenciadorLivros();
        (gerenciador as any).livros = [];
    });

    test('cria e lista um livro', () => {
        const livro = new Livro('1234567890', 'Dom Casmurro', 'Machado de Assis', 1899);
        gerenciador.criarLivro(livro);
        const livros = gerenciador.obterLivros();

        expect(livros.length).toBe(1);
        expect(livros[0].titulo).toBe('Dom Casmurro');
    });

    test('não permite ISBN duplicado', () => {
        const a = new Livro('123', 'A', 'X', 2000);
        const b = new Livro('123', 'B', 'Y', 2001);
        gerenciador.criarLivro(a);
        expect(() => gerenciador.criarLivro(b)).toThrow();
    });

    test('remove livro', () => {
        const livro = new Livro('999', 'Removível', 'Z', 2020);
        gerenciador.criarLivro(livro);
        gerenciador.removerLivro('999');
        expect(gerenciador.obterLivros().length).toBe(0);
    });
});
