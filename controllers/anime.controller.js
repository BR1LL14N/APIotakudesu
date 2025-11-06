const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const errors = require("../helpers/errors");
const episodeHelper = require("../helpers/episodeHelper");
const { baseUrl } = require("../helpers/base-url");

// Helper function untuk format response
const formatResponse = (status, message, data, meta = {}) => {
  return {
    status: status,
    message: message,
    data: data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
};

exports.detailAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = url.baseUrl + `anime/${id}`;

  console.log("Fetching anime detail:", fullUrl);

  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    const response = await Axios.get(fullUrl, config);
    const $ = cheerio.load(response.data);
    const detailElement = $(".venser").find(".fotoanime");
    let object = {};
    let episode_list = [];

    object.thumb = detailElement.find("img").attr("src");
    object.anime_id = req.params.id;

    let genre_name, genre_id, genre_link;
    let genreList = [];

    object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text()
      .trim();

    detailElement.find(".infozin").filter(function () {
      object.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "")
        .trim();
      object.japanese = $(this)
        .find("p")
        .children()
        .eq(1)
        .text()
        .replace("Japanese: ", "")
        .trim();
      object.score = parseFloat(
        $(this).find("p").children().eq(2).text().replace("Skor: ", "").trim()
      );
      object.producer = $(this)
        .find("p")
        .children()
        .eq(3)
        .text()
        .replace("Produser:  ", "")
        .trim();
      object.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "")
        .trim();
      object.status = $(this)
        .find("p")
        .children()
        .eq(5)
        .text()
        .replace("Status: ", "")
        .trim();

      const totalEpText = $(this)
        .find("p")
        .children()
        .eq(6)
        .text()
        .replace("Total Episode: ", "")
        .trim();
      object.total_episode = totalEpText ? parseInt(totalEpText) : null;

      object.duration = $(this)
        .find("p")
        .children()
        .eq(7)
        .text()
        .replace("Durasi: ", "")
        .trim();
      object.release_date = $(this)
        .find("p")
        .children()
        .eq(8)
        .text()
        .replace("Tanggal Rilis: ", "")
        .trim();
      object.studio = $(this)
        .find("p")
        .children()
        .eq(9)
        .text()
        .replace("Studio: ", "")
        .trim();

      $(this)
        .find("p")
        .children()
        .eq(10)
        .find("span > a")
        .each(function () {
          genre_name = $(this).text();
          genre_id = $(this)
            .attr("href")
            .replace(`https://otakudesu.best/genres/`, "");
          genre_link = $(this).attr("href");
          genreList.push({ genre_name, genre_id, genre_link });
        });
      object.genre_list = genreList;
    });

    // Scrape episode list
    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
      (i, element) => {
        const episodeLink = $(element).find("span > a").attr("href");
        let episodeId = "";
        if (episodeLink) {
          episodeId = episodeLink
            .replace("https://otakudesu.best/episode/", "")
            .replace("https://otakudesu.best/", "")
            .replace(/\/$/, "");
        }

        const dataList = {
          title: $(element).find("span > a").text().trim(),
          id: episodeId,
          link: episodeLink,
          uploaded_on: $(element).find(".zeebr").text().trim(),
        };
        episode_list.push(dataList);
      }
    );

    object.episode_list = episode_list.length === 0 ? [] : episode_list;

    // Scrape batch link
    const batchLinkElement = $("div.venser > div:nth-child(6) > ul");
    const hasBatchLink = batchLinkElement.text().trim().length !== 0;

    if (hasBatchLink) {
      const batchLink = batchLinkElement
        .find("li > span:nth-child(1) > a")
        .attr("href");
      object.batch_link = {
        id: batchLink
          ? batchLink
              .replace(`https://otakudesu.best/batch/`, "")
              .replace(/\/$/, "")
          : null,
        link: batchLink || null,
      };
    } else {
      object.batch_link = null;
    }

    res.status(200).json(
      formatResponse("success", "Anime detail retrieved successfully", object, {
        source_url: fullUrl,
        has_episodes: episode_list.length > 0,
        has_batch: hasBatchLink,
      })
    );
  } catch (err) {
    console.error("Error fetching anime detail:", err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.batchAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}batch/${id}`;

  console.log("Fetching batch download:", fullUrl);

  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    const response = await Axios.get(fullUrl, config);
    const $ = cheerio.load(response.data);

    const title =
      $(".batchlink > h4").text().trim() ||
      $(".venser .post-show > h1.posttl").text().trim();

    const downloadList = {};

    $(".batchlink ul li").each(function (index) {
      const qualityText = $(this).find("strong").text().trim();
      const sizeText = $(this).find("i").text().trim();
      const links = [];

      $(this)
        .find("a")
        .each(function () {
          const host = $(this).text().trim();
          const link = $(this).attr("href");
          if (host && link) {
            links.push({
              host: host,
              url: link,
            });
          }
        });

      if (qualityText && links.length > 0) {
        const qualityKeys = [
          "quality_360p",
          "quality_480p",
          "quality_720p",
          "quality_1080p",
        ];
        const qualityKey = qualityKeys[index] || `quality_${index}`;

        downloadList[qualityKey] = {
          quality: qualityText,
          size: sizeText,
          total_links: links.length,
          download_links: links,
        };
      }
    });

    res.status(200).json(
      formatResponse(
        "success",
        "Batch download links retrieved successfully",
        {
          title: title,
          download_list: downloadList,
        },
        {
          source_url: fullUrl,
          total_qualities: Object.keys(downloadList).length,
        }
      )
    );
  } catch (err) {
    console.error("Error fetching batch:", err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.epsAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}episode/${id}`;

  console.log("Fetching episode:", fullUrl);
  console.log("Episode ID:", id);

  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    const response = await Axios.get(fullUrl, config);
    const $ = cheerio.load(response.data);

    const title =
      $(".download > h4").text().trim() || $(".venutama > h1").text().trim();

    console.log("Episode title:", title);

    // Extract iframe URL from embed_holder
    const iframeUrl = $("#embed_holder iframe").attr("src");
    console.log("Iframe URL:", iframeUrl);

    // Try to extract direct video URL from iframe
    let directVideoUrl = null;

    if (iframeUrl) {
      console.log("Attempting to extract video from iframe...");
      const extractedUrl = await episodeHelper.get(iframeUrl);

      if (extractedUrl !== "-") {
        directVideoUrl = extractedUrl;
        console.log("Successfully extracted video URL");
      }
    }

    // Extract mirror links with data-content
    const mirrors = {
      mirror_360p: [],
      mirror_480p: [],
      mirror_720p: [],
    };

    $("#embed_holder > div.mirrorstream > ul.m360p > li").each((idx, el) => {
      const host = $(el).find("a").text().trim();
      const dataContent = $(el).find("a").attr("data-content");
      const href = $(el).find("a").attr("href");

      if (host) {
        const mirrorData = {
          host: host,
          data_content: dataContent || null,
        };

        if (dataContent) {
          try {
            const decoded = Buffer.from(dataContent, "base64").toString(
              "utf-8"
            );
            mirrorData.decoded_data = JSON.parse(decoded);
          } catch (e) {
            console.log("Failed to decode data-content for", host);
          }
        }

        if (href && href !== "#") {
          mirrorData.url = href;
        }

        mirrors.mirror_360p.push(mirrorData);
      }
    });

    $("#embed_holder > div.mirrorstream > ul.m480p > li").each((idx, el) => {
      const host = $(el).find("a").text().trim();
      const dataContent = $(el).find("a").attr("data-content");
      const href = $(el).find("a").attr("href");

      if (host) {
        const mirrorData = {
          host: host,
          data_content: dataContent || null,
        };

        if (dataContent) {
          try {
            const decoded = Buffer.from(dataContent, "base64").toString(
              "utf-8"
            );
            mirrorData.decoded_data = JSON.parse(decoded);
          } catch (e) {
            console.log("Failed to decode data-content for", host);
          }
        }

        if (href && href !== "#") {
          mirrorData.url = href;
        }

        mirrors.mirror_480p.push(mirrorData);
      }
    });

    $("#embed_holder > div.mirrorstream > ul.m720p > li").each((idx, el) => {
      const host = $(el).find("a").text().trim();
      const dataContent = $(el).find("a").attr("data-content");
      const href = $(el).find("a").attr("href");

      if (host) {
        const mirrorData = {
          host: host,
          data_content: dataContent || null,
        };

        if (dataContent) {
          try {
            const decoded = Buffer.from(dataContent, "base64").toString(
              "utf-8"
            );
            mirrorData.decoded_data = JSON.parse(decoded);
          } catch (e) {
            console.log("Failed to decode data-content for", host);
          }
        }

        if (href && href !== "#") {
          mirrorData.url = href;
        }

        mirrors.mirror_720p.push(mirrorData);
      }
    });

    // Extract download links
    const downloadList = {};

    console.log("Download elements found:", $(".download ul li").length);

    $(".download ul li").each(function (index) {
      const qualityText = $(this).find("strong").text().trim();
      const sizeText = $(this).find("i").text().trim();
      const links = [];

      $(this)
        .find("a")
        .each(function () {
          const host = $(this).text().trim();
          const url = $(this).attr("href");
          if (host && url) {
            links.push({
              host: host,
              url: url,
            });
          }
        });

      if (qualityText && links.length > 0) {
        const qualityKeys = [
          "quality_360p",
          "quality_480p",
          "quality_720p",
          "quality_1080p",
        ];
        const qualityKey = qualityKeys[index] || `quality_${index}`;

        downloadList[qualityKey] = {
          quality: qualityText,
          size: sizeText,
          total_links: links.length,
          download_links: links,
        };
      }
    });

    res.status(200).json(
      formatResponse(
        "success",
        "Episode data retrieved successfully",
        {
          title: title,
          streaming: {
            iframe_url: iframeUrl || null,
            direct_video_url: directVideoUrl,
            recommendation:
              "Use iframe_url for reliable playback. Direct video URL may expire after a few hours.",
          },
          stream_mirrors: mirrors,
          download_list: downloadList,
        },
        {
          source_url: fullUrl,
          has_iframe: iframeUrl !== null && iframeUrl !== undefined,
          has_direct_video: directVideoUrl !== null,
          has_downloads: Object.keys(downloadList).length > 0,
          total_qualities: Object.keys(downloadList).length,
        }
      )
    );
  } catch (err) {
    console.error("Error fetching episode:", err.message);
    console.error("Stack trace:", err.stack);
    errors.requestFailed(req, res, err);
  }
};

exports.epsMirror = async (req, res) => {
  const mirrorId = req.body.mirrorId;
  const animeId = req.params.animeId;
  const fullUrl = `${baseUrl}${animeId}/${mirrorId}`;

  console.log("Fetching mirror:", fullUrl);

  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    const response = await Axios.get(fullUrl, config);
    const $ = cheerio.load(response.data);

    const title = $(".venutama > h1").text().trim();
    const streamLink = $("#pembed > div > iframe").attr("src");

    let videoStreamLink = "-";
    if (streamLink) {
      videoStreamLink = await episodeHelper.get(streamLink);
    }

    res.status(200).json(
      formatResponse(
        "success",
        "Mirror stream link retrieved successfully",
        {
          title: title,
          stream_link: videoStreamLink,
          embed_link: streamLink,
        },
        {
          source_url: fullUrl,
        }
      )
    );
  } catch (error) {
    console.error("Error fetching mirror:", error.message);
    errors.requestFailed(req, res, error);
  }
};
