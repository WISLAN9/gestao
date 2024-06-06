

// Exemplo de dados de estoque (pode ser substituído por um banco de dados ou API)
let estoque = [];

// Função para exibir a lista de estoque
function exibirEstoque() {
    const listaEstoque = document.getElementById('lista-estoque');
    listaEstoque.innerHTML = '';

    estoque.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${item.nome}: ${item.quantidade}`; // Adiciona o número do item antes do nome
        listItem.classList.add('item-estoque'); // Adicionando a classe CSS
        
        const btnEditar = document.createElement('button');
        const iconEditar = document.createElement('i');
        iconEditar.classList.add('fas', 'fa-edit'); // Adiciona classes para o ícone de editar
        btnEditar.appendChild(iconEditar);
        btnEditar.addEventListener('click', () => editarItem(index));
        
        const btnExcluir = document.createElement('button');
        const iconExcluir = document.createElement('i');
        iconExcluir.classList.add('fas', 'fa-trash-alt'); // Adiciona classes para o ícone de excluir
        btnExcluir.appendChild(iconExcluir);
        btnExcluir.addEventListener('click', () => excluirItem(index));

        listItem.appendChild(btnEditar);
        listItem.appendChild(btnExcluir);
        listaEstoque.appendChild(listItem);
    });
}


// Função para adicionar um novo item ao estoque
function adicionarItem(nome, quantidade) {
    estoque.push({ nome, quantidade });
    exibirEstoque();
}

// Função para editar um item do estoque
function editarItem(index) {
    const novoNome = prompt('Novo nome do item:');
    const novaQuantidade = parseInt(prompt('Nova quantidade do item:'));

    if (novoNome && novaQuantidade >= 0) {
        estoque[index] = { nome: novoNome, quantidade: novaQuantidade };
        exibirEstoque();
    }
}

// Função para excluir um item do estoque
function excluirItem(index) {
    estoque.splice(index, 1);
    exibirEstoque();
}

// Evento de envio do formulário de adicionar item
document.getElementById('form-estoque').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome-item').value;
    const quantidade = parseInt(document.getElementById('quantidade-item').value);

    if (nome && quantidade >= 0) {
        adicionarItem(nome, quantidade);
        document.getElementById('form-estoque').reset();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
});

// Exibir estoque inicial ao carregar a página
window.addEventListener('load', () => {
    
});

// Função para exportar os dados do estoque para Excel
function exportarParaExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    estoque.forEach(function(row) {
        csvContent += row.nome + "," + row.quantidade + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "estoque.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

// Função para exportar os dados do estoque para Word
function exportarParaWord() {
    const doc = new docx.Document();

    estoque.forEach(function(row) {
        doc.addParagraph(new docx.Paragraph(row.nome + ": " + row.quantidade));
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "estoque.docx");
    });
}


