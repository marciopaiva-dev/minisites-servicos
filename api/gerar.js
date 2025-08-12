// /api/gerar.js  (Vercel Serverless)
// Proxy: recebe do front e repassa para o Netlify Function.
// Evita CORS e mantém o front simples.

export default async function handler(req, res) {
  // Aceitamos apenas POST do front
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // Lê o JSON do front
    const { servico, descricaoCurta, whats } = req.body || {};

    // Validação simples (opcional)
    if (!servico || !descricaoCurta || !whats) {
      return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes" });
    }

    // Chama sua function no Netlify
    const NETLIFY_ENDPOINT = "https://minisites-servicos.netlify.app/.netlify/functions/gerar";

    const upstream = await fetch(NETLIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servico, descricaoCurta, whats }),
    });

    // Propaga status e JSON de volta para o browser
    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: `Proxy error: ${err?.message || err}` });
  }
}

