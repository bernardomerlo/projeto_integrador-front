document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".conteudo-box");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o comportamento padrão de recarregar a página.

        const nome = form.nome.value.trim();
        const username = form.usuario.value.trim();
        const email = form.email.value.trim();
        const senha = form.senha.value.trim();

        if (!nome || !email || !senha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const payload = {
            fullname: nome,
            username: username,
            email: email,
            password: senha,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Cadastro realizado com sucesso!");
                window.location.href = "../feed/index.html";
            } else {
                const errorData = await response.json();
                alert(`Erro ao cadastrar: ${errorData.message || "Erro desconhecido"}`);
            }
        } catch (error) {
            console.error("Erro ao fazer a requisição:", error);
            alert("Erro ao conectar com o servidor.");
        }
    });
});
