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
const postsContainer = document.getElementById("postsContainer");

// Modal para Comentários
const commentModal = document.getElementById("commentModal");
const closeCommentModal = document.getElementById("closeCommentModal");
const submitCommentButton = document.getElementById("submitCommentButton");
const commentContent = document.getElementById("commentContent");
let currentPostId = null;

// Abrir modal
function openCommentModal(postId) {
  currentPostId = postId;
  commentModal.style.display = "block";
}

// Fechar modal
closeCommentModal.addEventListener("click", () => {
  commentModal.style.display = "none";
  commentContent.value = "";
});

// Enviar comentário
submitCommentButton.addEventListener("click", async () => {
  const content = commentContent.value.trim();
  if (!content) {
    alert("Por favor, insira um comentário.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/comments/${currentPostId}/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao enviar comentário: ${response.status}`);
    }

    alert("Comentário enviado com sucesso!");
    commentModal.style.display = "none";
    commentContent.value = "";
  } catch (error) {
    console.error("Erro ao enviar comentário:", error);
    alert("Ocorreu um erro ao enviar o comentário.");
  }
});

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

function renderPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <div class="post-meta">
          <span>ID: ${post.id}</span> |
          <span>Data: ${new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div class="post-likes">
          <button class="like-button" data-post-id="${post.id}">Curtir</button>
          <span class="like-count" id="like-count-${post.id}">0</span> curtidas
          <button class="comment-button" data-post-id="${
            post.id
          }">Comentar</button>
      </div>
  `;

  postElement
    .querySelector(".like-button")
    .addEventListener("click", () => handleLike(post.id));
  postElement
    .querySelector(".comment-button")
    .addEventListener("click", () => openCommentModal(post.id));
  postsContainer.appendChild(postElement);
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

    const likeCountElement = document.getElementById(`like-count-${postId}`);
    const currentCount = parseInt(likeCountElement.textContent) || 0;
    likeCountElement.textContent = currentCount + 1;
  } catch (error) {
    console.error("Erro ao curtir o post:", error);
  }
}

// Criar novo post
const createPostForm = document.getElementById("createPostForm");

createPostForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

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

    // Limpar formulário
    createPostForm.reset();
  } catch (error) {
    console.error("Erro ao criar post:", error);
    alert("Ocorreu um erro ao criar o post.");
  }
});

// Inicializar
loadPosts();
