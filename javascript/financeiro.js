document.addEventListener("DOMContentLoaded", function () {
    const caixaPopup = document.getElementById("caixa-popup");
    const totalCaixaSpan = document.getElementById("total-caixa");
    const totalEntradasSpan = document.getElementById("total-entradas");
    const totalSaidasSpan = document.getElementById("total-saidas");
    const listaTransacoes = document.getElementById("lista-transacoes");

    let caixa = JSON.parse(localStorage.getItem("caixa")) || { total: 0, entradas: 0, saidas: 0, transacoes: [] };

    function atualizarResumoCaixa() {
        totalCaixaSpan.textContent = caixa.total.toFixed(2);
        totalEntradasSpan.textContent = caixa.entradas.toFixed(2);
        totalSaidasSpan.textContent = caixa.saidas.toFixed(2);

        if (caixa.total >= 0) {
            totalCaixaSpan.classList.add("verde");
            totalCaixaSpan.classList.remove("vermelho");
        } else {
            totalCaixaSpan.classList.add("vermelho");
            totalCaixaSpan.classList.remove("verde");
        }

        listaTransacoes.innerHTML = "";
        caixa.transacoes.forEach(transacao => {
            const li = document.createElement("li");
            li.textContent = `${transacao.tipo === "entrada" ? "Entrada" : "Saída"}: ${transacao.descricao} - R$ ${transacao.valor.toFixed(2)}`;
            listaTransacoes.appendChild(li);
        });
    }

    window.abrirCaixaPopup = function () {
        caixaPopup.style.display = "flex";
    }

    window.fecharCaixaPopup = function () {
        caixaPopup.style.display = "none";
    }

    window.adicionarCaixa = function () {
        const descricao = document.getElementById("descricao").value;
        const valor = parseFloat(document.getElementById("valor").value);
        const tipo = document.getElementById("tipo").value;

        if (descricao && !isNaN(valor)) {
            if (tipo === "entrada") {
                caixa.total += valor;
                caixa.entradas += valor;
            } else if (tipo === "saida") {
                caixa.total -= valor;
                caixa.saidas += valor;
            }

            caixa.transacoes.push({ descricao, valor, tipo });
            localStorage.setItem("caixa", JSON.stringify(caixa));

            atualizarResumoCaixa();
            document.getElementById("caixa-form").reset();
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    }

    window.limparCaixa = function () {
        caixa = { total: 0, entradas: 0, saidas: 0, transacoes: [] };
        localStorage.setItem("caixa", JSON.stringify(caixa));
        atualizarResumoCaixa();
    }

    atualizarResumoCaixa();
});
