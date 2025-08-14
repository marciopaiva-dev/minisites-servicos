module.exports = async (req, res) => {
  if (req.method === "HEAD") return res.status(200).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  return res.status(200).json({ ok: true, ping: "alive", plataforma: "vercel", agora: new Date().toISOString() });
};
