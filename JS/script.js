document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formCadastro");
    const tabela = document.querySelector("table");

    let cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];
    let indexEditando = null;

    // Máscaras
    function mascaraCPF(cpf) {
        return cpf
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function mascaraTelefone(telefone) {
        return telefone
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    }

    function mascaraData(data) {
        return data
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})\d+?$/, "$1");
    }

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

    function salvarCadastros() {
        localStorage.setItem("cadastros", JSON.stringify(cadastros));
    }

    function atualizarTabela() {
        if (!tabela) return;

        const linhas = tabela.querySelectorAll("tr");
        linhas.forEach((linha, index) => {
            if (index !== 0) linha.remove();
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
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });

        const botoesExcluir = document.querySelectorAll(".delete-btn");
        botoesExcluir.forEach((botao) => {
            botao.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                cadastros.splice(index, 1);
                salvarCadastros();
                atualizarTabela();
            });
        });

        const botoesEditar = document.querySelectorAll(".edit-btn");
        botoesEditar.forEach((botao) => {
            botao.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                const cadastro = cadastros[index];

                localStorage.setItem("editandoIndex", index);
                window.location.href = "./index.html";
            });
        });
    }

    if (tabela) {
        atualizarTabela();
    }

    if (form) {
        const indexEditandoStorage = localStorage.getItem("editandoIndex");

        if (indexEditandoStorage !== null) {
            indexEditando = parseInt(indexEditandoStorage);
            const cadastro = cadastros[indexEditando];

            document.getElementById("name").value = cadastro.nome;
            document.getElementById("sobrenome").value = cadastro.sobrenome;
            document.getElementById("email").value = cadastro.email;
            document.getElementById("cpf").value = cadastro.cpf;
            document.getElementById("telefone").value = cadastro.telefone;
            document.getElementById("data").value = cadastro.data;
            document.getElementById("endereço").value = cadastro.endereco;

            localStorage.removeItem("editandoIndex");
        }

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

            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (!cpfRegex.test(cpf)) {
                alert("CPF inválido. Formato: 000.000.000-00");
                return;
            }

            if (!telefoneRegex.test(telefone)) {
                alert("Telefone inválido. Formato: (00) 00000-0000");
                return;
            }

            if (!dataRegex.test(data)) {
                alert("Data inválida. Formato: dd/mm/aaaa");
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

            if (indexEditando !== null) {
                cadastros[indexEditando] = novoCadastro;
                indexEditando = null;
                alert("Cadastro atualizado com sucesso!");
            } else {
                cadastros.push(novoCadastro);
                alert("Cadastro salvo com sucesso!");
            }

            salvarCadastros();
            form.reset();
        });
    }
});
