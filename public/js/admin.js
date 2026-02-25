const urlParams = new URLSearchParams(window.location.search);
const restauranteId = urlParams.get("r");

db.collection("restaurantes").doc(restauranteId).collection("pedidos")
.onSnapshot(snapshot => {
  const el = document.getElementById("pedidos");
  el.innerHTML = "";
  snapshot.forEach(doc => {
    const p = doc.data();
    el.innerHTML += `<p>${p.cliente} - ${p.status}</p>`;
  });
});

async function salvarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);

  await db.collection("restaurantes").doc(restauranteId).collection("produtos").add({
    nome, preco
  });

  alert("Produto criado!");
}
