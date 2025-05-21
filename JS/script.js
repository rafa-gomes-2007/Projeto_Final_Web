document.addEventListener("DOMContentLoaded", function() {
    console.log("Script carregado")


    const form = document.getElementById("formCadastro")
    const tabela = document.getElementById("tabela")

    let cadastros = []
    let cadastrosEditando = null

    const cadastrosSalvos  = localStorage.getItem("cadastros")

    if (cadastrosSalvos) {
        cadastros = JSON.parse(cadastrosSalvos)
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault()

        console.log("Formulário enviado")

        const nome = document.getElementById("name").value.trim()
        const sobrenome = document.getElementById("sobrenome").value.trim()
        const email = document.getElementById("email").value.trim()
        const cpf = document.getElementById("cpf").value.trim()
        const telefone = document.getElementById("telefone").value.trim()
        const data = document.getElementById("data").value.trim()
        const endereço = document.getElementById("endereço").value.trim()

        const novoCadastro = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            cpf: cpf,
            telefone: telefone,
            data: data,
            endereço: endereço,
        }

        console.log("Cadastro:", novoCadastro)

        if (cadastrosEditando !== null) {
            cadastros[cadastrosEditando] = novoCadastro
            cadastrosEditando = null
            document.querySelector(".cadastroSubmit").textContent = "Enviar"
        }

        else{
            cadastros.push(novoCadastro)
        }

        localStorage.setItem("cadastros", JSON.stringify(cadastros))

        form.reset()
    })
})
