// /functions/gerar.js  (Netlify Function — ESM)
const ALLOW_ORIGIN = "*"; // em prod, troque para: https://minisites-servicos.vercel.app

const CORS = {
  "Access-Control-Allow-Origin": ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

const j = (code, data) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json", ...CORS },
  body: JSON.stringify(data)
});
const nocontent = () => ({ statusCode: 204, headers: CORS, body: "" });

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return nocontent();
  if (event.httpMethod !== "POST") return j(405, { ok: false, error: "Método não permitido" });

  try {
    const { servico, descricaoCurta, whats } = JSON.parse(event.body || "{}");
    if (!servico || !descricaoCurta || !whats) return j(400, { ok: false, error: "Campos obrigatórios ausentes" });

    // ... sua lógica atual que publica o minisite ...

    // responda SEMPRE com urlFinal (e mantenha outputs.previewUrl por compatibilidade)
    return j(200, {
      ok: true,
      urlFinal: "https://exemplo.netlify.app/meu-minisite", // <- a URL que você gera
      outputs: { previewUrl: "https://exemplo.netlify.app/meu-minisite" }
    });
  } catch (e) {
    return j(500, { ok: false, error: String(e?.message || e) });
  }
}
