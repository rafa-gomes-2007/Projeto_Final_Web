document.addEventListener("DOMContentLoaded", function () {
    console.log("Script carregado");

    const form = document.getElementById("formCadastro");
    const tabela = document.querySelector("table"); // Seleciona a tabela da página tabela.html

    let cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    // 🔥 Máscara CPF
    function mascaraCPF(cpf) {
        return cpf
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // 🔥 Máscara Telefone
    function mascaraTelefone(telefone) {
        return telefone
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    }

    // 🔥 Máscara Data
    function mascaraData(data) {
        return data
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})\d+?$/, "$1");
    }

    // 🎯 Aplica as máscaras se estiver na página de cadastro
    const inputCPF = document.getElementById("cpf");
    const inputTelefone = document.getElementById("telefone");
    const inputData = document.getElementById("data");

    if (inputCPF) {
        inputCPF.addEventListener("input", (e) => {
            e.target.value = mascaraCPF(e.target.value);
        });
    }

    if (inputTelefone) {
        inputTelefone.addEventListener("input", (e) => {
            e.target.value = mascaraTelefone(e.target.value);
        });
    }

    if (inputData) {
        inputData.addEventListener("input", (e) => {
            e.target.value = mascaraData(e.target.value);
        });
    }

    // 📝 Função para salvar no localStorage
    function salvarCadastros() {
        localStorage.setItem("cadastros", JSON.stringify(cadastros));
    }

    // 🚀 Atualiza a tabela na página tabela.html
    function atualizarTabela() {
        if (!tabela) return; // Se não estiver na página da tabela, sai

        const linhas = tabela.querySelectorAll("tr");
        linhas.forEach((linha, index) => {
            if (index !== 0) linha.remove(); // Mantém só o cabeçalho
        });

        cadastros.forEach((cadastro, index) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${cadastro.nome}</td>
                <td>${cadastro.sobrenome}</td>
                <td>${cadastro.email}</td>
                <td>${cadastro.cpf}</td>
                <td>${cadastro.telefone}</td>
                <td>${cadastro.data}</td>
                <td>${cadastro.endereco}</td>
                <td>
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });

        // 🎯 Ativa os botões de excluir
        const botoesExcluir = document.querySelectorAll(".delete-btn");
        botoesExcluir.forEach((botao) => {
            botao.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                cadastros.splice(index, 1);
                salvarCadastros();
                atualizarTabela();
            });
        });
    }

    // 🚧 Se estiver na página da tabela, carrega ela
    if (tabela) {
        atualizarTabela();
    }

    // 📄 Função de envio do formulário de cadastro
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nome = document.getElementById("name").value.trim();
            const sobrenome = document.getElementById("sobrenome").value.trim();
            const email = document.getElementById("email").value.trim();
            const cpf = document.getElementById("cpf").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
            const data = document.getElementById("data").value.trim();
            const endereco = document.getElementById("endereço").value.trim();

            if (
                !nome ||
                !sobrenome ||
                !email ||
                !cpf ||
                !telefone ||
                !data ||
                !endereco
            ) {
                alert("Preencha todos os campos.");
                return;
            }

            // 🔍 Regex de validação dos formatos
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (!cpfRegex.test(cpf)) {
                alert("CPF inválido. Formato correto: 000.000.000-00");
                return;
            }

            if (!telefoneRegex.test(telefone)) {
                alert("Telefone inválido. Formato correto: (00) 00000-0000");
                return;
            }

            if (!dataRegex.test(data)) {
                alert("Data inválida. Formato correto: dd/mm/aaaa");
                return;
            }

            const novoCadastro = {
                nome,
                sobrenome,
                email,
                cpf,
                telefone,
                data,
                endereco,
            };

            cadastros.push(novoCadastro);
            salvarCadastros();

            alert("Cadastro salvo com sucesso!");
            form.reset();
        });
    }
});
