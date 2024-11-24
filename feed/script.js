// Verificar autenticação
function isAuthenticated() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  return token && userId;
}

if (!isAuthenticated()) {
  alert("Você não está autenticado. Redirecionando para o login.");
  window.location.href = "/index.html";
}

const token = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

// Elementos principais
const postTitleInput = document.querySelector("#postTitle"); // Corrigido para capturar título
const postBoxInput = document.querySelector("#postContent");
const postBoxButton = document.querySelector(".postBox__postButton");
const feedContainer = document.querySelector(".postsContainer"); // Corrigido para container correto
const widgetsInput = document.querySelector(".widgets__input input");

// Carregar posts
async function loadPosts() {
  try {
    const response = await fetch("http://localhost:8080/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao carregar posts.");

    const posts = await response.json();
    posts.forEach(renderPost);
  } catch (error) {
    console.error("Erro ao carregar posts:", error);
  }
}

// Renderizar um post no feed
function renderPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  postElement.innerHTML = `
      <div class="post__header">
          <img src="img/foto.svg" alt="Avatar" class="post__avatar">
          <h3>${post.title}</h3> <!-- Título do post -->
      </div>
      <div class="post__body">
          <p>${post.content}</p>
      </div>
      <div class="post__footer">
          <span>ID: ${post.id} | Data: ${new Date(
    post.createdAt
  ).toLocaleString()}</span>
          <div class="post__actions">
              <button class="like-button" data-post-id="${
                post.id
              }">Curtir</button>
              <span class="like-count" id="like-count-${post.id}">${
    post.likesCount
  }</span> curtidas
              <button class="comment-button" data-post-id="${
                post.id
              }">Comentar</button>
          </div>
      </div>
  `;
  postElement.querySelector(".like-button").addEventListener("click", () => {
    handleLike(post.id);
  });

  feedContainer.prepend(postElement);
}
async function handleLike(postId) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/posts/${postId}/like/user/${userId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Erro ao curtir o post.");

    // Atualizar contador de curtidas
    const likeCountElement = document.getElementById(`like-count-${postId}`);
    const currentCount = parseInt(likeCountElement.textContent) || 0;
    likeCountElement.textContent = currentCount + 1;
  } catch (error) {
    console.error("Erro ao curtir o post:", error);
    alert("Não foi possível curtir o post. Tente novamente mais tarde.");
  }
}

// Criar novo post
postBoxButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const title = postTitleInput.value.trim();
  const content = postBoxInput.value.trim();

  if (!title || !content) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/posts/user/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      }
    );

    if (!response.ok) throw new Error(`Erro ao criar post: ${response.status}`);

    const newPost = await response.json();
    alert("Post criado com sucesso!");
    renderPost(newPost);

    // Limpar entrada
    postTitleInput.value = "";
    postBoxInput.value = "";
  } catch (error) {
    console.error("Erro ao criar post:", error);
    alert("Ocorreu um erro ao criar o post.");
  }
});

// Pesquisar no feed
widgetsInput.addEventListener("input", () => {
  const searchTerm = widgetsInput.value.toLowerCase();
  const posts = document.querySelectorAll(".post");
  posts.forEach((post) => {
    const content = post.textContent.toLowerCase();
    post.style.display = content.includes(searchTerm) ? "block" : "none";
  });
});

// Inicializar
loadPosts();
