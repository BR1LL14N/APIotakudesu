const { default: Axios } = require("axios");
const cheerio = require("cheerio");

const get = async (url) => {
  console.log("Extracting video from iframe:", url);

  try {
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://otakudesu.best/",
      },
      timeout: 10000,
    };

    const response = await Axios.get(url, config);
    const $ = cheerio.load(response.data);

    // Method 1: Look for <video><source> tag
    let videoUrl = null;

    const videoSource = $("video source").attr("src");
    if (videoSource) {
      console.log("Found video URL from <video><source> tag");
      return videoSource;
    }

    // Method 2: Look for video tag with src attribute
    const videoSrc = $("video").attr("src");
    if (videoSrc) {
      console.log("Found video URL from <video src>");
      return videoSrc;
    }

    // Method 3: Search in JavaScript for file: pattern (common in video players)
    const htmlContent = response.data;

    // Pattern 1: "file":"url"
    let source1 = htmlContent.search('"file":');
    if (source1 !== -1) {
      const end = htmlContent.indexOf('","', source1);
      if (end !== -1) {
        videoUrl = htmlContent.substring(source1 + 8, end);
        console.log('Found video URL from "file": pattern');
        return videoUrl;
      }
    }

    // Pattern 2: 'file':'url'
    let source2 = htmlContent.search("'file':");
    if (source2 !== -1) {
      const end = htmlContent.indexOf("','", source2);
      if (end !== -1) {
        videoUrl = htmlContent.substring(source2 + 8, end);
        console.log("Found video URL from 'file': pattern");
        return videoUrl;
      }
    }

    // Pattern 3: file: "url" (without quotes on key)
    let source3 = htmlContent.search(/file:\s*"/);
    if (source3 !== -1) {
      const start = htmlContent.indexOf('"', source3 + 5) + 1;
      const end = htmlContent.indexOf('"', start);
      if (start > 0 && end !== -1) {
        videoUrl = htmlContent.substring(start, end);
        console.log("Found video URL from file: pattern");
        return videoUrl;
      }
    }

    // Pattern 4: src: "url"
    let source4 = htmlContent.search(/src:\s*"/);
    if (source4 !== -1) {
      const start = htmlContent.indexOf('"', source4 + 4) + 1;
      const end = htmlContent.indexOf('"', start);
      if (start > 0 && end !== -1) {
        videoUrl = htmlContent.substring(start, end);
        // Make sure it's a video URL
        if (
          videoUrl.includes("http") &&
          (videoUrl.includes(".mp4") ||
            videoUrl.includes("videoplayback") ||
            videoUrl.includes("googlevideo"))
        ) {
          console.log("Found video URL from src: pattern");
          return videoUrl;
        }
      }
    }

    // Pattern 5: Look for googlevideo.com URLs directly
    const googleVideoMatch = htmlContent.match(
      /https?:\/\/[^\s"']+googlevideo\.com[^\s"']*/
    );
    if (googleVideoMatch) {
      console.log("Found Google Video URL");
      return googleVideoMatch[0].replace(/&amp;/g, "&");
    }

    // Pattern 6: Look for any mp4 URLs
    const mp4Match = htmlContent.match(/https?:\/\/[^\s"']+\.mp4[^\s"]*/);
    if (mp4Match) {
      console.log("Found MP4 URL");
      return mp4Match[0].replace(/&amp;/g, "&");
    }

    console.log("No video URL found in iframe");
    return "-";
  } catch (error) {
    console.error("Error extracting video:", error.message);
    return "-";
  }
};

module.exports = { get };
