const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (req, res) => {

  if (req.method !== "GET") {

    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });

  }

  try {

    const rss =
      "https://news.google.com/rss/search?q=Sri+Lanka+when%3A1d&hl=en-LK&gl=LK&ceid=LK%3Aen";


    const response =
      await axios.get(
        rss,
        {
          timeout: 15000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        }
      );


    const parsed =
      await xml2js.parseStringPromise(
        response.data
      );


    const items =
      (
        parsed.rss?.channel?.[0]?.item ||
        []
      )
      .slice(0,10)
      .map(item => ({

        title:
          item.title?.[0] ||
          "News",

        link:
          item.link?.[0] ||
          "#",

        source:
          item.source?.[0]?._ ||
          item.source?.[0] ||
          "Google News"

      }));


    return res.status(200).json({
      ok: true,
      items
    });


  } catch (error) {

    console.error(error.message);

    return res.status(500).json({
      ok: false,
      error: "News service unavailable"
    });

  }

};
