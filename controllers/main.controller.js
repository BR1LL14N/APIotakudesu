const cheerio = require("cheerio");
const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const baseUrl = url.baseUrl;
const completeAnime = url.completeAnime;
const onGoingAnime = url.onGoingAnime;
const errors = require("../helpers/errors");
const ImageList = require("../helpers/image_genre").ImageList;

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

exports.home = (req, res) => {
  let home = {};
  let on_going = [];
  let complete = [];

  // Add headers to avoid 403
  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  Axios.get(baseUrl, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let episode, uploaded_on, day_updated, thumb, title, link, id;

      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "").replace(/\/$/, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");

          on_going.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            day_updated,
            link,
          });
        });
      home.on_going = on_going;
      return response;
    })
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let episode, uploaded_on, score, thumb, title, link, id;

      element
        .children()
        .eq(1)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "").replace(/\/$/, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));

          complete.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            score,
            link,
          });
        });
      home.complete = complete;

      // Response dengan format yang lebih baik
      res.status(200).json(
        formatResponse(
          "success",
          "Homepage data retrieved successfully",
          {
            on_going: {
              total: on_going.length,
              list: on_going,
            },
            complete: {
              total: complete.length,
              list: complete,
            },
          },
          {
            source_url: baseUrl,
          }
        )
      );
    })
    .catch((e) => {
      console.error("Error fetching home:", e.message);
      res.status(500).json(
        formatResponse("error", "Failed to fetch homepage data", null, {
          error: e.message,
        })
      );
    });
};

exports.completeAnimeList = (req, res) => {
  const params = req.params.page;
  const page = typeof params === "undefined" ? 1 : parseInt(params);
  const pageParam = page === 1 ? "" : `page/${page}`;
  const fullUrl = `${baseUrl}${completeAnime}${pageParam}`;

  console.log("Fetching:", fullUrl);

  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  Axios.get(fullUrl, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let animeList = [];
      let episode, uploaded_on, score, thumb, title, link, id;

      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));

          animeList.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            score,
            link,
          });
        });

      // Response dengan format yang lebih baik
      res.status(200).json(
        formatResponse(
          "success",
          "Complete anime list retrieved successfully",
          {
            anime_list: animeList,
          },
          {
            current_page: page,
            total_items: animeList.length,
            source_url: fullUrl,
            has_next_page: animeList.length > 0,
            next_page: animeList.length > 0 ? page + 1 : null,
          }
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching complete anime:", err.message);
      res.status(500).json(
        formatResponse("error", "Failed to fetch complete anime list", null, {
          current_page: page,
          error: err.message,
        })
      );
    });
};

exports.onGoingAnimeList = (req, res) => {
  const params = req.params.page;
  const page = typeof params === "undefined" ? 1 : parseInt(params);
  const pageParam = page === 1 ? "" : `page/${page}`;
  const fullUrl = `${baseUrl}${onGoingAnime}${pageParam}`;

  console.log("Fetching:", fullUrl);

  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  Axios.get(fullUrl, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let animeList = [];
      let episode, uploaded_on, day_updated, thumb, title, link, id;

      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");

          animeList.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            day_updated,
            link,
          });
        });

      // Response dengan format yang lebih baik
      res.status(200).json(
        formatResponse(
          "success",
          "Ongoing anime list retrieved successfully",
          {
            anime_list: animeList,
          },
          {
            current_page: page,
            total_items: animeList.length,
            source_url: fullUrl,
            has_next_page: animeList.length > 0,
            next_page: animeList.length > 0 ? page + 1 : null,
          }
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching ongoing anime:", err.message);
      res.status(500).json(
        formatResponse("error", "Failed to fetch ongoing anime list", null, {
          current_page: page,
          error: err.message,
        })
      );
    });
};

exports.schedule = (req, res) => {
  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  Axios.get(baseUrl + url.schedule, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".kgjdwl321");
      let scheduleList = [];
      let day, anime_name, link, id;

      element.find(".kglist321").each(function () {
        day = $(this).find("h2").text();
        let animeList = [];

        $(this)
          .find("ul > li")
          .each(function () {
            anime_name = $(this).find("a").text();
            link = $(this).find("a").attr("href");
            id = link.replace(baseUrl + "anime/", "");
            animeList.push({ anime_name, id, link });
          });

        scheduleList.push({
          day,
          total_anime: animeList.length,
          anime_list: animeList,
        });
      });

      // Response dengan format yang lebih baik
      res.status(200).json(
        formatResponse(
          "success",
          "Anime schedule retrieved successfully",
          {
            schedule: scheduleList,
          },
          {
            total_days: scheduleList.length,
            source_url: baseUrl + url.schedule,
          }
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching schedule:", err.message);
      res.status(500).json(
        formatResponse("error", "Failed to fetch anime schedule", null, {
          error: err.message,
        })
      );
    });
};

exports.genre = (req, res) => {
  const fullUrl = baseUrl + url.genreList;

  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  Axios.get(fullUrl, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".genres");
      let genreList = [];

      element.find("li > a").each(function (i, el) {
        let object = {};
        object.genre_name = $(el).text();
        object.id = $(el).attr("href").replace("/genres/", "");
        object.link = baseUrl + $(el).attr("href");
        object.image_link = ImageList[i] || null;
        genreList.push(object);
      });

      // Response dengan format yang lebih baik
      res.status(200).json(
        formatResponse(
          "success",
          "Genre list retrieved successfully",
          {
            genre_list: genreList,
          },
          {
            total_genres: genreList.length,
            source_url: fullUrl,
          }
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching genres:", err.message);
      res.status(500).json(
        formatResponse("error", "Failed to fetch genre list", null, {
          error: err.message,
        })
      );
    });
};

exports.animeByGenre = (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber) || 1;
  const id = req.params.id;
  const fullUrl = baseUrl + `genres/${id}/page/${pageNumber}`;

  console.log("Fetching:", fullUrl);

  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  Axios.get(fullUrl, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".page");
      let animeList = [];

      element.find(".col-md-4").each(function () {
        let object = {};
        object.anime_name = $(this).find(".col-anime-title").text();
        object.thumb = $(this).find("div.col-anime-cover > img").attr("src");
        object.link = $(this).find(".col-anime-title > a").attr("href");
        object.id = $(this)
          .find(".col-anime-title > a")
          .attr("href")
          .replace("https://otakudesu.best/anime/", "");
        object.studio = $(this).find(".col-anime-studio").text();
        object.episode = $(this).find(".col-anime-eps").text();
        object.score = parseFloat($(this).find(".col-anime-rating").text());
        object.release_date = $(this).find(".col-anime-date").text();

        let genreList = [];
        $(this)
          .find(".col-anime-genre > a")
          .each(function () {
            let genre_name = $(this).text();
            let genre_link = $(this).attr("href");
            let genre_id = genre_link.replace(
              "https://otakudesu.best/genres/",
              ""
            );
            genreList.push({ genre_name, genre_link, genre_id });
          });

        object.genre_list = genreList;
        animeList.push(object);
      });

      // Response dengan format yang lebih baik
      res.status(200).json(
        formatResponse(
          "success",
          "Anime by genre retrieved successfully",
          {
            anime_list: animeList,
          },
          {
            genre_id: id,
            current_page: pageNumber,
            total_items: animeList.length,
            source_url: fullUrl,
            has_next_page: animeList.length > 0,
            next_page: animeList.length > 0 ? pageNumber + 1 : null,
          }
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching anime by genre:", err.message);
      errors.requestFailed(req, res, err);
    });
};

exports.search = async (req, res) => {
  const query = req.params.query.toLowerCase().trim();
  const fullUrl = `${baseUrl}anime-list/`;

  console.log("Searching anime with query:", query);

  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  };

  try {
    const response = await Axios.get(fullUrl, config);
    const $ = cheerio.load(response.data);
    const allAnime = [];

    // Scrape all anime from anime-list
    $(".bariskelom").each(function () {
      const letter = $(this).find(".barispenz a").text().trim();

      $(this)
        .find(".jdlbar ul li")
        .each(function () {
          const animeLink = $(this).find("a").attr("href");
          const animeTitle = $(this).find("a").text().trim();
          const fullTitle = $(this).find("a").attr("title");

          if (animeLink && animeTitle) {
            allAnime.push({
              title: animeTitle,
              full_title: fullTitle || animeTitle,
              id: animeLink.replace(`${baseUrl}anime/`, "").replace(/\/$/, ""),
              link: animeLink,
              letter: letter,
            });
          }
        });
    });

    console.log(`Total anime in database: ${allAnime.length}`);

    // Filter anime based on query
    const searchResults = allAnime.filter((anime) => {
      const titleMatch = anime.title.toLowerCase().includes(query);
      const idMatch = anime.id.toLowerCase().includes(query);
      return titleMatch || idMatch;
    });

    console.log(`Found ${searchResults.length} results for query: ${query}`);

    // Sort results by relevance (exact match first, then partial match)
    searchResults.sort((a, b) => {
      const aExactTitle = a.title.toLowerCase() === query;
      const bExactTitle = b.title.toLowerCase() === query;
      const aExactId = a.id.toLowerCase() === query;
      const bExactId = b.id.toLowerCase() === query;

      // Exact matches first
      if (aExactTitle || aExactId) return -1;
      if (bExactTitle || bExactId) return 1;

      // Then by title length (shorter = more relevant)
      return a.title.length - b.title.length;
    });

    res.status(200).json(
      formatResponse(
        "success",
        searchResults.length > 0
          ? `Found ${searchResults.length} anime matching "${query}"`
          : `No anime found matching "${query}"`,
        {
          search_results: searchResults,
        },
        {
          query: query,
          total_results: searchResults.length,
          total_anime_checked: allAnime.length,
          source_url: fullUrl,
        }
      )
    );
  } catch (err) {
    console.error("Error searching anime:", err.message);
    res.status(500).json(
      formatResponse("error", "Failed to search anime", null, {
        query: query,
        error: err.message,
      })
    );
  }
};

exports.animeList = (req, res) => {
  const fullUrl = `${baseUrl}anime-list/`;

  console.log("Fetching anime list:", fullUrl);

  const config = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  };

  Axios.get(fullUrl, config)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const allAnime = [];

      // Loop through each letter group
      $(".bariskelom").each(function () {
        const letter = $(this).find(".barispenz a").text().trim();

        // Loop through each anime in this letter group
        $(this)
          .find(".jdlbar ul li")
          .each(function () {
            const animeLink = $(this).find("a").attr("href");
            const animeTitle = $(this).find("a").attr("title");

            // Extract clean title (remove episode info in parentheses)
            const cleanTitle = $(this).find("a").text().trim();

            if (animeLink && animeTitle) {
              allAnime.push({
                title: cleanTitle,
                full_title: animeTitle,
                id: animeLink
                  .replace(`${baseUrl}anime/`, "")
                  .replace(/\/$/, ""),
                link: animeLink,
                letter: letter,
              });
            }
          });
      });

      // Group by letter
      const groupedByLetter = {};
      allAnime.forEach((anime) => {
        if (!groupedByLetter[anime.letter]) {
          groupedByLetter[anime.letter] = [];
        }
        groupedByLetter[anime.letter].push({
          title: anime.title,
          full_title: anime.full_title,
          id: anime.id,
          link: anime.link,
        });
      });

      res.status(200).json(
        formatResponse(
          "success",
          "All anime list retrieved successfully",
          {
            anime_list: allAnime,
            grouped_by_letter: groupedByLetter,
          },
          {
            source_url: fullUrl,
            total_anime: allAnime.length,
            total_letters: Object.keys(groupedByLetter).length,
          }
        )
      );
    })
    .catch((err) => {
      console.error("Error fetching anime list:", err.message);
      res.status(500).json(
        formatResponse("error", "Failed to fetch anime list", null, {
          error: err.message,
        })
      );
    });
};
