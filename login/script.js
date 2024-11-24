document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".conteudo-box");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o comportamento padrão de recarregar a página.

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    if (!email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const payload = {
      email: email,
      password: senha,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Resposta do servidor:", data);


        const token = data.token; // Recebe o token do backend
        const username = data.name; // Recebe o nome do usuário do backend
        const userId = data.id; // Recebe o nome do usuário do backend

        // Armazena o token e o username no localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);

        // Redireciona para a página principal
        window.location.href = "../feed/index.html"; // Substitua pelo caminho real da sua página
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao fazer login: ${errorData.message || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
