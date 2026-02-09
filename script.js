const apiURL = "https://script.google.com/macros/s/AKfycbwSB1x33MtnOcsBzSp0b2XaidFkgX3NyYV8OB76crajC62t81wpTAKpjOabKOGLzdAB/exec";

// Campos
const form = document.getElementById("form");
const ministerio = document.getElementById("ministerio");
const setor = document.getElementById("setor");
const departamento = document.getElementById("departamento");
const outroDepartamento = document.getElementById("outroDepartamento");
const pagamento = document.getElementById("pagamento");
const comprovante = document.getElementById("comprovante");
const labelComprovante = document.getElementById("labelComprovante");

// Exibições condicionais
ministerio.onchange = () =>
  setor.classList.toggle("hidden", !ministerio.value);

departamento.onchange = () =>
  outroDepartamento.classList.toggle("hidden", departamento.value !== "Outro");

pagamento.onchange = () => {
  const pix = pagamento.value === "Pix";
  comprovante.classList.toggle("hidden", !pix);
  labelComprovante.classList.toggle("hidden", !pix);
};

// Envio do formulário
form.onsubmit = async (e) => {
  e.preventDefault();

  let base64 = "", nomeArq = "", tipoArq = "";

  if (comprovante.files.length) {
    const file = comprovante.files[0];
    nomeArq = file.name;
    tipoArq = file.type;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    await new Promise(resolve => {
      reader.onload = () => {
        base64 = reader.result.split(",")[1];
        resolve();
      };
    });
  }

  const payload = {
    nome: form.nome.value,
    telefone: form.telefone.value,
    ministerio: ministerio.value,
    setor: setor.value,
    departamento: departamento.value,
    outroDepartamento: outroDepartamento.value,
    pagamento: pagamento.value,
    comprovanteBase64: base64,
    comprovanteNome: nomeArq,
    comprovanteTipo: tipoArq
  };

  await fetch(apiURL, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  window.location.href = "sucesso.html";
};
