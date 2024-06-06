document.addEventListener("DOMContentLoaded", function () {
    const listaOrcamentos = document.getElementById("lista-orcamentos");
    const orcamentoForm = document.getElementById("orcamento-form");
    const filtroOrcamentos = document.getElementById("filtro-orcamentos");
    const popupCriarOrcamento = document.getElementById("popup-criar-orcamento");
    const abrirPopupCriarOrcamento = document.getElementById("abrir-popup-criar-orcamento");
    const fecharPopupCriarOrcamento = document.getElementById("fechar-popup-criar-orcamento");
    const mensagemVazia = document.getElementById("mensagem-vazia");
    
    let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
    let orcamentoEditando = null;

    abrirPopupCriarOrcamento.onclick = function() {
        popupCriarOrcamento.style.display = "block";
    }

    fecharPopupCriarOrcamento.onclick = function() {
        popupCriarOrcamento.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == popupCriarOrcamento) {
            popupCriarOrcamento.style.display = "none";
        }
    }

    function atualizarListaOrcamentos() {
        listaOrcamentos.innerHTML = '';
        if (orcamentos.length === 0) {
            mensagemVazia.style.display = "block";
        } else {
            mensagemVazia.style.display = "none";
            orcamentos.forEach((orcamento, index) => {
                const li = document.createElement("li");
                li.textContent = `Orçamento ${index + 1}: ${orcamento.cliente}`;
                li.onclick = () => exibirDetalhesOrcamento(index, li);
                listaOrcamentos.appendChild(li);
            });
        }
    }

    function exibirDetalhesOrcamento(index, element) {
        const orcamento = orcamentos[index];
        const detalhesOrcamento = document.createElement("div");
        detalhesOrcamento.classList.add("detalhes-orcamento");
        detalhesOrcamento.innerHTML = `
            <p>Cliente: ${orcamento.cliente}</p>
            <p>Data: ${orcamento.data}</p>
            <p>Total: R$ ${orcamento.total.toFixed(2)}</p>
            <h3>Itens:</h3>
            <ul>
                ${orcamento.itens.map(item => `<li>${item.descricao} - ${item.quantidade} x R$ ${item.preco.toFixed(2)}</li>`).join('')}
            </ul>
            <button onclick="editarOrcamento(${index})">Editar</button>
            <button onclick="excluirOrcamento(${index})">Excluir</button>
        `;

        if (element.nextSibling && element.nextSibling.classList.contains("detalhes-orcamento")) {
            element.nextSibling.remove();
        } else {
            element.insertAdjacentElement("afterend", detalhesOrcamento);
        }
    }

    window.adicionarItem = function () {
        const itensOrcamento = document.getElementById("itens-orcamento");
        const div = document.createElement("div");
        div.innerHTML = `
            <input type="text" name="descricao" placeholder="Descrição" required>
            <input type="number" name="quantidade" placeholder="Quantidade" required>
            <input type="number" name="preco" placeholder="Preço Unitário" required>
        `;
        itensOrcamento.appendChild(div);
    }

    window.salvarOrcamento = function () {
        const cliente = document.getElementById("cliente").value;
        const data = document.getElementById("data").value;
        const itens = Array.from(document.querySelectorAll("#itens-orcamento div")).map(div => ({
            descricao: div.querySelector("input[name='descricao']").value,
            quantidade: parseFloat(div.querySelector("input[name='quantidade']").value),
            preco: parseFloat(div.querySelector("input[name='preco']").value)
        }));

        const total = itens.reduce((acc, item) => acc + (item.quantidade * item.preco), 0);

        if (orcamentoEditando !== null) {
            orcamentos[orcamentoEditando] = { cliente, data, itens, total };
            orcamentoEditando = null;
        } else {
            orcamentos.push({ cliente, data, itens, total });
        }

        localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
        orcamentoForm.reset(); // Limpar o formulário após salvar
        orcamentoEditando = null; // Garantir que não há mais edição em andamento
        document.getElementById("itens-orcamento").innerHTML = '<h3>Itens do Orçamento</h3><button type="button" onclick="adicionarItem()">Adicionar Item</button>';
        atualizarListaOrcamentos();
        popupCriarOrcamento.style.display = "none";
    }

    window.editarOrcamento = function (index) {
        const orcamento = orcamentos[index];
        document.getElementById("cliente").value = orcamento.cliente;
        document.getElementById("data").value = orcamento.data;
        const itensOrcamento = document.getElementById("itens-orcamento");
        itensOrcamento.innerHTML = '<h3>Itens do Orçamento</h3>';
        orcamento.itens.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <input type="text" name="descricao" placeholder="Descrição" value="${item.descricao}" required>
                <input type="number" name="quantidade" placeholder="Quantidade" value="${item.quantidade}" required>
                <input type="number" name="preco" placeholder="Preço Unitário" value="${item.preco}" required>
            `;
            itensOrcamento.appendChild(div);
        });
        
        // Adicionar o botão "Adicionar Item" após preencher os itens do orçamento
        const botaoAdicionarItem = document.createElement("button");
        botaoAdicionarItem.textContent = "Adicionar Item";
        botaoAdicionarItem.setAttribute("type", "button");
        botaoAdicionarItem.setAttribute("onclick", "adicionarItem()");
        itensOrcamento.appendChild(botaoAdicionarItem);
        
        orcamentoEditando = index;
        popupCriarOrcamento.style.display = "block";
    }
    
    window.excluirOrcamento = function (index) {
        if (confirm("Você tem certeza que deseja excluir este orçamento?")) {
            orcamentos.splice(index, 1);
            localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
            atualizarListaOrcamentos();
        }
    }

    filtroOrcamentos.addEventListener("input", function () {
        const filtro = filtroOrcamentos.value.toLowerCase();
        Array.from(listaOrcamentos.children).forEach(li => {
            if (li.textContent.toLowerCase().includes(filtro)) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        });
    });

    atualizarListaOrcamentos();
});
