export interface DAO<T, ID = number> {
    
    //Adiciona/Cria um novo item no repositório. 
    criar(item: T): void;

    //Retorna todos os itens do repositório.
    listar(): T[];

    //Busca um item por identificador (ID/ISBN).
    buscarPorId(id: ID): T | undefined;

    
    //Atualiza um item existente identificado por id com dados parciais.
    atualizar(id: ID, dadosAtualizados: Partial<T>): void;

    //Remove o item identificado por id.
    remover(id: ID): void;
}
