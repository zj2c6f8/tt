const axios = require("axios");

module.exports = async (req, res) => {

  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  const url = req.query.url;

  if (
    !url ||
    (
      !url.includes("tiktok.com") &&
      !url.includes("vt.tiktok.com")
    )
  ) {
    return res.status(400).json({
      ok: false,
      error: "Invalid TikTok URL"
    });
  }

  try {

    const apiUrl =
      `https://api.azbry.com/api/download/tiktokv2?url=${encodeURIComponent(url)}`;

    const response = await axios.get(
      apiUrl,
      {
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    if (
      !response.data?.status ||
      !response.data?.result
    ) {
      return res.status(502).json({
        ok: false,
        error: "TikTok video could not be found"
      });
    }

    return res.status(200).json({
      ok: true,
      result: response.data.result
    });

  } catch (error) {

    console.error(error.message);

    return res.status(500).json({
      ok: false,
      error: "TikTok API error"
    });

  }

};
