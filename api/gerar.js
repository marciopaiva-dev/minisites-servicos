// /api/gerar.js  (Vercel Serverless Function)
// Proxy para evitar CORS: recebe do front e encaminha para o Netlify.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { servico, descricaoCurta, whats } = req.body || {};
    if (!servico || !descricaoCurta || !whats) {
      return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes" });
    }

    const NETLIFY_ENDPOINT = "https://minisites-servicos.netlify.app/.netlify/functions/gerar";

    const upstream = await fetch(NETLIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servico, descricaoCurta, whats }),
    });

    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: `Proxy error: ${err?.message || err}` });
  }
}
