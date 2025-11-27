import { Membro } from '../classes/Membro';
import { GerenciadorMembros } from '../services/GerenciadorMembros';

jest.mock('fs');

describe('GerenciadorMembros (simplificado)', () => {
    let gerenciador: GerenciadorMembros;

    beforeEach(() => {
        gerenciador = new GerenciadorMembros();
        (gerenciador as any).membros = [];
        (gerenciador as any).proximoId = 1;
    });

    test('cria membro e verifica ativo', () => {
        const m = new Membro(1, 'João', 'Rua 1', '11111111', 'M001');
        gerenciador.criarMembro(m);
        const membros = gerenciador.obterMembros();
        expect(membros.length).toBe(1);
        expect(membros[0].ativo).toBe(true);
    });

    test('não permite matrícula duplicada', () => {
        const a = new Membro(1, 'João', 'Rua 1', '11111111', 'M001');
        const b = new Membro(2, 'Maria', 'Rua 2', '22222222', 'M001');
        gerenciador.criarMembro(a);
        expect(() => gerenciador.criarMembro(b)).toThrow();
    });
});
