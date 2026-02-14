const API_URL = "https://script.google.com/macros/s/AKfycbwjKXNaziKPKLhtuXEnYCpVlwv75u7gBSyzJxTZ5E1-4q9KkHpMXHnqbKPP0qVj4jDk/exec";

const form = document.getElementById("formInscricao");
const ministerio = document.getElementById("ministerio");
const setor = document.getElementById("setor");
const departamento = document.getElementById("departamento");
const outroDepartamento = document.getElementById("outroDepartamento");
const pagamento = document.getElementById("pagamento");
const pixArea = document.getElementById("pixArea");
const comprovanteInput = document.getElementById("comprovante");
const copyPixBtn = document.getElementById("copyPix");
const pixKey = document.getElementById("pixKey");

// MOSTRAR SETOR
ministerio.addEventListener("change", () => {
  setor.classList.toggle("hidden", ministerio.value === "");
});

// MOSTRAR OUTRO DEP
departamento.addEventListener("change", () => {
  outroDepartamento.classList.toggle("hidden", departamento.value !== "Outro");
});

// MOSTRAR PIX
pagamento.addEventListener("change", () => {
  pixArea.classList.toggle("hidden", pagamento.value !== "Pix");
});

// COPIAR PIX
copyPixBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(pixKey.innerText).then(() => {
    copyPixBtn.innerText = "Copiado!";
    setTimeout(() => copyPixBtn.innerText = "Copiar", 2000);
  });
});

// SUBMIT
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (pagamento.value === "Pix" && !comprovanteInput.files.length) {
    alert("⚠️ O comprovante Pix é obrigatório.");
    return;
  }

  let base64 = "", tipo = "", nomeArquivo = "";

  if (comprovanteInput.files.length) {
    const file = comprovanteInput.files[0];
    tipo = file.type;
    nomeArquivo = file.name;
    base64 = await toBase64(file);
  }

  const payload = {
    nome: nome.value,
    telefone: telefone.value,
    ministerio: ministerio.value,
    setor: setor.value,
    departamento: departamento.value,
    outroDepartamento: outroDepartamento.value,
    pagamento: pagamento.value,
    comprovanteBase64: base64,
    comprovanteTipo: tipo,
    comprovanteNome: nomeArquivo
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const json = await res.json();

  if (json.status === "ok") {
    window.location.href = `sucesso.html?id=${json.id}`;
  } else {
    alert("Erro ao enviar inscrição.");
  }
});

// BASE64
function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
