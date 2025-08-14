// /api/gerar.js
// Serverless function na Vercel que repassa a requisição para a função do Netlify.
// Mantém mesma origem (sem CORS) e simplifica o front.

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { servico, descricaoCurta, whats } = body;

    if (!servico || !descricaoCurta || !whats) {
      return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes" });
    }

    const NETLIFY_ENDPOINT = "https://minisites-servicos.netlify.app/.netlify/functions/gerar";

    const upstream = await fetch(NETLIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servico, descricaoCurta, whats })
    });

    // tenta ler JSON; se vier vazio, mantém objeto
    let data = {};
    try { data = await upstream.json(); } catch {}

    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: `Proxy error: ${err?.message || err}` });
  }
};
