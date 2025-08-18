// functions/gerar.js — usa fetch nativo do Node 18 (sem node-fetch)
const ALLOW_ORIGIN = "*"; // em produção, troque para o domínio do seu front (ex.: https://minisites-servicos.vercel.app)

const CORS = {
  "Access-Control-Allow-Origin": ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

const json = (status, data) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", ...CORS },
  body: JSON.stringify(data)
});
const noContent = () => ({ statusCode: 204, headers: CORS, body: "" });

export async function handler(event) {
  const method = event.httpMethod || "GET";
  if (method === "OPTIONS") return noContent();
  if (method !== "POST") return json(405, { ok: false, error: "Método não permitido" });

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { servico, descricaoCurta, whats } = body;

    if (!servico || !descricaoCurta || !whats) {
      return json(400, { ok: false, error: "Campos obrigatórios ausentes" });
    }

    // ------------------------------------------------------------
    // TODO: sua lógica real de publicação (Netlify Deploy API etc.)
    // Aqui deixo um exemplo de resposta de sucesso para o teste:
    const slug = String(servico).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const urlFinal = `https://SEU-SITE.netlify.app/minisites/${slug}/index.html`;
    // ------------------------------------------------------------

    return json(200, {
      ok: true,
      urlFinal,
      outputs: { previewUrl: urlFinal, docxUrl: null }
    });

  } catch (e) {
    return json(500, { ok: false, error: String(e?.message || e) });
  }
}
