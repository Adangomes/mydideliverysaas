const urlParams = new URLSearchParams(window.location.search);
const restauranteId = urlParams.get("r");

let carrinho = [];

async function carregarRestaurante() {
  const doc = await db.collection("restaurantes").doc(restauranteId).get();
  if (doc.exists) {
    document.getElementById("nomeRestaurante").innerText = doc.data().nome;
  }
}

async function carregarProdutos() {
  const snapshot = await db.collection("restaurantes").doc(restauranteId).collection("produtos").get();
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();
    container.innerHTML += `
      <div class="produto">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco}</p>
        <button onclick="addCarrinho('${doc.id}','${p.nome}',${p.preco})">Adicionar</button>
      </div>
    `;
  });
}

function addCarrinho(id, nome, preco) {
  carrinho.push({ nome, preco });
  renderCarrinho();
}

function renderCarrinho() {
  const el = document.getElementById("itens");
  el.innerHTML = "";
  carrinho.forEach(p => {
    el.innerHTML += `<p>${p.nome} - R$ ${p.preco}</p>`;
  });
}

async function finalizarPedido() {
  const nome = prompt("Seu nome:");
  const whatsapp = prompt("WhatsApp:");

  await db.collection("restaurantes").doc(restauranteId).collection("pedidos").add({
    cliente: nome,
    whatsapp,
    itens: carrinho,
    status: "novo"
  });

  alert("Pedido enviado!");
  carrinho = [];
  renderCarrinho();
}

function abrirAdmin() {
  document.getElementById("adminModal").style.display = "block";
}

async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  await auth.signInWithEmailAndPassword(email, senha);
  window.location.href = "/admin/dashboard.html?r=" + restauranteId;
}

carregarRestaurante();
carregarProdutos();
