const express = require("express");
const app = express();

app.use(express.json());

let itens = [
  { id: 1, nome: "Exemplo", quantidade: 5 }
];

// --- ROTAS ---

// ROTA GET: Lista todos os itens
app.get("/itens", function(req, res) {
  // Apenas envia o array completo como resposta JSON
  res.json(itens);
});

// ROTA POST: Adiciona um novo item
app.post("/itens", function(req, res) {
  // Pega os dados do corpo da requisição (JSON)
  const { nome, quantidade } = req.body;

  // Validação simples
  if (!nome || quantidade == null) {
    return res.status(400).json({ erro: "Nome e quantidade são obrigatórios." });
  }

  // Cria o novo objeto e dá um ID simples
  const novoItem = {
    id: itens.length + 1,
    nome: nome,
    quantidade: quantidade
  };

  // Adiciona o novo item ao nosso array global
  itens.push(novoItem);

  // Envia o item criado como resposta, com status 201 (Criado)
  res.status(201).json(novoItem);
});

// ROTA PUT: Atualiza um item específico por ID
app.put("/itens/:id", function(req, res) {
  // Pega o ID da URL (ex: /itens/1) e converte para número
  const idDoItem = parseInt(req.params.id); 
  const { nome, quantidade } = req.body;

  // Procura o índice (posição) do item no array
  let itemEncontrado = itens.find(function(item) {
    return item.id === idDoItem;
  });

  if (!itemEncontrado) {
    return res.status(404).json({ erro: "Item não encontrado." });
  }

  // Atualiza as propriedades se elas existirem no corpo da requisição
  if (nome) {
    itemEncontrado.nome = nome;
  }
  if (quantidade) {
    itemEncontrado.quantidade = quantidade;
  }

  // Retorna o item atualizado
  res.json(itemEncontrado);
});

// ROTA DELETE: Remove um item específico por ID
app.delete("/itens/:id", function(req, res) {
  // Pega o ID da URL e converte para número
  const idDoItem = parseInt(req.params.id);

  const initialLength = itens.length;

  // Filtra o array, criando um NOVO array sem o item com o ID especificado
  itens = itens.filter(function(item) {
    return item.id !== idDoItem;
  }); 

  if (itens.length === initialLength) {
      return res.status(404).json({ erro: "Item não encontrado para deletar." });
  }

  // Envia apenas o status 204 (Sem Conteúdo) para sucesso
  res.status(204).send(); 
});


// Inicia o servidor
app.listen(3000, function() {
    console.log(`Servidor rodando em http://localhost:3000`);
});
