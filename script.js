const API_URL = "https://script.google.com/macros/s/AKfycbz_dPxW98x6t5Lzv6Hg8q1V2S3EA41cB1z3lxQO9OqzsWdtTncbI0NbY_-wkiGbcMzF/exec";

const form = document.getElementById("formInscricao");
const ministerio = document.getElementById("ministerio");
const setor = document.getElementById("setor");
const departamento = document.getElementById("departamento");
const outroDepartamento = document.getElementById("outroDepartamento");

ministerio.onchange = () => {
  setor.classList.toggle("hidden", ministerio.value === "");
};

departamento.onchange = () => {
  outroDepartamento.classList.toggle("hidden", departamento.value !== "Outro");
};

form.onsubmit = async (e) => {
  e.preventDefault();

  const file = comprovante.files[0];
  let base64 = "", tipo = "", nomeArquivo = "";

  if (file) {
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
    alert("Erro ao enviar inscrição");
  }
};

function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
