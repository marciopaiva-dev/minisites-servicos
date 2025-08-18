// /api/gerar.js (Vercel)
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { servico, descricaoCurta, whats } = body;

    if (!servico || !descricaoCurta || !whats) {
      return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes" });
    }

    // ✅ SUA função no Netlify:
    const NETLIFY_ENDPOINT = "https://minisites-servicos.netlify.app/.netlify/functions/gerar";

    const upstream = await fetch(NETLIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servico, descricaoCurta, whats })
    });

    const text = await upstream.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch {}
    return res.status(upstream.status).json(data);

  } catch (err) {
    return res.status(500).json({ ok: false, error: `Proxy error: ${err?.message || err}` });
  }
};
