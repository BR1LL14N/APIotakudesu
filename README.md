# OtakuDesu REST API 🎌

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![API Version](https://img.shields.io/badge/API%20Version-v2.0-orange)](https://github.com/BR1LL14N/APIotakudesu)

**Unofficial REST API for** [OtakuDesu](https://otakudesu.best/) - Nonton anime subtitle Indonesia terlengkap.

> ⚠️ **Disclaimer**: API ini dibuat untuk tujuan edukasi dan pembelajaran. Semua konten adalah milik [OtakuDesu](https://otakudesu.best/).

---

## ✨ Features

- ✅ **Complete Anime List** - Daftar anime yang sudah tamat
- ✅ **Ongoing Anime List** - Anime yang sedang tayang
- ✅ **Search Anime** - Pencarian anime berdasarkan judul atau ID
- ✅ **Anime Details** - Informasi lengkap anime (synopsis, genre, rating, dll)
- ✅ **Episode Streaming** - Link streaming video (iframe & direct video URL)
- ✅ **Download Links** - Link download berbagai kualitas (360p, 480p, 720p, 1080p)
- ✅ **Batch Download** - Download semua episode sekaligus
- ✅ **Schedule** - Jadwal rilis anime per hari
- ✅ **Genre Filtering** - Filter anime berdasarkan genre
- ✅ **Pagination Support** - Navigasi halaman untuk list anime

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** atau **yarn**

### Installation

1. **Clone repository**
```bash
git clone https://github.com/BR1LL14N/APIotakudesu.git
cd APIotakudesu
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
```

3. **Start server**
```bash
# Development mode (dengan nodemon)
npm run dev

# Production mode
npm start
```

4. **Test API**
```bash
curl http://localhost:3000/api/home
```

Server akan berjalan di `http://localhost:3000`

---

## 📚 API Documentation

**Base URL (Local):** `http://localhost:3000/api`  
**Base URL (Production):** `https://your-project.vercel.app/api`

**API Version:** v2.0

### Response Format

Semua endpoint menggunakan format response konsisten:

```json
{
  "status": "success" | "error",
  "message": "Descriptive message",
  "data": {
    // Actual data here
  },
  "meta": {
    "timestamp": "2025-11-05T10:00:00.000Z",
    "source_url": "https://otakudesu.best/...",
    // Additional metadata
  }
}
```

---

## 🔗 Endpoints

### 1. 🏠 Home
Get anime ongoing dan complete terbaru dari homepage.

```http
GET /api/home
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "on_going": {
      "total": 15,
      "list": [...]
    },
    "complete": {
      "total": 10,
      "list": [...]
    }
  }
}
```

---

### 2. 📋 All Anime List
Get semua daftar anime (dikelompokkan per huruf).

```http
GET /api/anime-list
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "anime_list": [
      {
        "title": "Naruto",
        "id": "naruto-sub-indo",
        "link": "https://otakudesu.best/anime/naruto-sub-indo/",
        "letter": "N"
      }
    ],
    "grouped_by_letter": {
      "A": [...],
      "N": [...]
    }
  },
  "meta": {
    "total_anime": 1500,
    "total_letters": 28
  }
}
```

---

### 3. ✅ Complete Anime List
List anime yang sudah tamat (completed).

```http
GET /api/complete
GET /api/complete/page/:page
```

**Parameters:**
- `page` (optional) - Nomor halaman (default: 1)

**Example:**
```bash
curl http://localhost:3000/api/complete
curl http://localhost:3000/api/complete/page/2
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "anime_list": [
      {
        "title": "Naruto Shippuden",
        "id": "naruto-shippuden-sub-indo",
        "thumb": "https://...",
        "episode": "500Episode",
        "uploaded_on": "01 Nov",
        "score": 8.5,
        "link": "https://..."
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "total_items": 25,
    "has_next_page": true,
    "next_page": 2
  }
}
```

---

### 4. 📺 Ongoing Anime List
List anime yang sedang tayang (ongoing).

```http
GET /api/ongoing/page/:page
```

**Parameters:**
- `page` - Nomor halaman

**Example:**
```bash
curl http://localhost:3000/api/ongoing/page/1
```

---

### 5. 📅 Schedule
Jadwal rilis anime per hari.

```http
GET /api/schedule
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "schedule": [
      {
        "day": "Senin",
        "total_anime": 5,
        "anime_list": [
          {
            "anime_name": "One Piece",
            "id": "one-piece-sub-indo",
            "link": "https://..."
          }
        ]
      }
    ]
  }
}
```

---

### 6. 🎭 Genre List
Daftar semua genre anime.

```http
GET /api/genres
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "genre_list": [
      {
        "genre_name": "Action",
        "id": "action/",
        "link": "https://otakudesu.best/genres/action/",
        "image_link": "https://..."
      }
    ]
  }
}
```

---

### 7. 🎬 Anime by Genre
Filter anime berdasarkan genre.

```http
GET /api/genres/:id/page/:pageNumber
```

**Parameters:**
- `id` - ID genre (e.g., `action`, `comedy`)
- `pageNumber` - Nomor halaman

**Example:**
```bash
curl http://localhost:3000/api/genres/action/page/1
```

---

### 8. 🔍 Search Anime
Search anime berdasarkan judul atau ID.

```http
GET /api/search/:query
```

**Parameters:**
- `query` - Kata kunci pencarian

**Example:**
```bash
curl http://localhost:3000/api/search/naruto
curl http://localhost:3000/api/search/one-piece
```

**Response:**
```json
{
  "status": "success",
  "message": "Found 5 anime matching \"naruto\"",
  "data": {
    "search_results": [
      {
        "title": "Naruto",
        "id": "naruto-sub-indo",
        "link": "https://...",
        "letter": "N"
      }
    ]
  },
  "meta": {
    "query": "naruto",
    "total_results": 5
  }
}
```

---

### 9. 📖 Anime Detail
Detail lengkap anime (synopsis, genre, episode list, batch link).

```http
GET /api/anime/:id
```

**Parameters:**
- `id` - ID anime (didapat dari search/list)

**Example:**
```bash
curl http://localhost:3000/api/anime/naruto-shippuden-sub-indo
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "thumb": "https://...",
    "anime_id": "naruto-shippuden-sub-indo",
    "title": "Naruto Shippuden",
    "japanese": "ナルト 疾風伝",
    "score": 8.5,
    "type": "TV",
    "status": "Completed",
    "total_episode": 500,
    "duration": "23 Menit",
    "release_date": "Feb 15, 2007",
    "studio": "Studio Pierrot",
    "synopsis": "...",
    "genre_list": [
      {
        "genre_name": "Action",
        "genre_id": "action/",
        "genre_link": "https://..."
      }
    ],
    "episode_list": [
      {
        "title": "Naruto Shippuden Episode 1",
        "id": "nrto-shippuden-episode-1-sub-indo",
        "link": "https://...",
        "uploaded_on": "15 Feb, 2007"
      }
    ],
    "batch_link": {
      "id": "naruto-shippuden-batch-sub-indo",
      "link": "https://..."
    }
  }
}
```

---

### 10. 📦 Batch Download
Link download batch (semua episode sekaligus).

```http
GET /api/batch/:id
```

**Parameters:**
- `id` - Batch ID (didapat dari anime detail)

**Example:**
```bash
curl http://localhost:3000/api/batch/naruto-shippuden-batch-sub-indo
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "Naruto Shippuden Batch Subtitle Indonesia",
    "download_list": {
      "quality_360p": {
        "quality": "MP4 360p",
        "size": "2.5 GB",
        "total_links": 7,
        "download_links": [
          {
            "host": "OtakuDrive",
            "url": "https://..."
          },
          {
            "host": "DesuDrive",
            "url": "https://..."
          }
        ]
      },
      "quality_480p": {...},
      "quality_720p": {...}
    }
  },
  "meta": {
    "total_qualities": 3
  }
}
```

---

### 11. 🎥 Episode Streaming & Download
Get link streaming (iframe + direct video) dan download per episode.

```http
GET /api/eps/:id
```

**Parameters:**
- `id` - Episode ID (didapat dari anime detail)

**Example:**
```bash
curl http://localhost:3000/api/eps/nrto-shippuden-episode-1-sub-indo
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "Naruto Shippuden Episode 1 Subtitle Indonesia",
    
    "streaming": {
      "iframe_url": "https://desustream.info/dstream/...",
      "direct_video_url": "https://rr1---sn-i3b7knsd.googlevideo.com/...",
      "recommendation": "Use iframe_url for reliable playback. Direct video URL may expire after a few hours."
    },
    
    "stream_mirrors": {
      "mirror_360p": [
        {
          "host": "otakuwatch5",
          "data_content": "eyJpZCI6MTg4OTk5...",
          "decoded_data": {
            "id": 188999,
            "i": 0,
            "q": "360p"
          }
        }
      ],
      "mirror_480p": [...],
      "mirror_720p": [...]
    },
    
    "download_list": {
      "quality_360p": {
        "quality": "360p",
        "size": "45.3 MB",
        "total_links": 5,
        "download_links": [
          {
            "host": "OtakuFiles",
            "url": "https://..."
          },
          {
            "host": "Mega",
            "url": "https://..."
          }
        ]
      },
      "quality_480p": {...},
      "quality_720p": {...}
    }
  },
  "meta": {
    "has_iframe": true,
    "has_direct_video": true,
    "has_downloads": true,
    "total_qualities": 3
  }
}
```

---

### 12. 🎬 Mirror Stream
Get alternative mirror streaming link.

```http
POST /api/eps/:animeId/mirror/
```

**Body:**
```json
{
  "mirrorId": "mirror-id-from-stream-mirrors"
}
```

---

## 🎯 Usage Examples

### Flow: Search → Detail → Episode → Stream

```bash
# 1. Search anime
curl http://localhost:3000/api/search/naruto

# Response: Get anime ID "naruto-shippuden-sub-indo"

# 2. Get detail anime
curl http://localhost:3000/api/anime/naruto-shippuden-sub-indo

# Response: Get episode ID "nrto-shippuden-episode-1-sub-indo"

# 3. Get episode streaming & download
curl http://localhost:3000/api/eps/nrto-shippuden-episode-1-sub-indo

# Response: Get iframe_url or direct_video_url for streaming
```

---

## 🎬 Cara Menggunakan Streaming

### Option 1: Embed Iframe (Recommended ⭐)

```html
<iframe 
  src="https://desustream.info/dstream/otakuwatch5/v3/index.php?id=..."
  width="100%" 
  height="500px"
  frameborder="0"
  allowfullscreen
  allow="autoplay; encrypted-media">
</iframe>
```

**Keuntungan:**
- ✅ Tidak expire
- ✅ Player built-in
- ✅ Reliable

### Option 2: Direct Video URL

```html
<video controls width="100%">
  <source src="https://rr1---sn-i3b7knsd.googlevideo.com/videoplayback?..." type="video/mp4">
  Your browser does not support the video tag.
</video>
```

**⚠️ Perhatian:** URL video akan expire dalam beberapa jam. Gunakan iframe untuk reliability lebih baik.

### Option 3: Video.js Player

```html
<link href="https://vjs.zencdn.net/8.3.0/video-js.css" rel="stylesheet" />
<script src="https://vjs.zencdn.net/8.3.0/video.min.js"></script>

<video id="my-video" class="video-js" controls preload="auto" width="640" height="360">
  <source src="{{direct_video_url}}" type="video/mp4" />
</video>

<script>
  var player = videojs('my-video');
</script>
```

---

## 💻 Code Examples

### JavaScript/Fetch

```javascript
// Search anime
async function searchAnime(query) {
  const response = await fetch(`http://localhost:3000/api/search/${query}`);
  const data = await response.json();
  return data.data.search_results;
}

// Get anime detail
async function getAnimeDetail(animeId) {
  const response = await fetch(`http://localhost:3000/api/anime/${animeId}`);
  const data = await response.json();
  return data.data;
}

// Get episode streaming
async function getEpisode(episodeId) {
  const response = await fetch(`http://localhost:3000/api/eps/${episodeId}`);
  const data = await response.json();
  return data.data;
}

// Usage
const results = await searchAnime('naruto');
const anime = await getAnimeDetail(results[0].id);
const episode = await getEpisode(anime.episode_list[0].id);
console.log(episode.streaming.iframe_url);
```

### React Component

```jsx
import { useState, useEffect } from 'react';

function AnimePlayer({ episodeId }) {
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/eps/${episodeId}`)
      .then(res => res.json())
      .then(data => {
        setEpisode(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [episodeId]);
  
  if (loading) return <div>Loading...</div>;
  if (!episode) return <div>Episode not found</div>;
  
  return (
    <div className="anime-player">
      <h2>{episode.title}</h2>
      
      {/* Streaming */}
      <div className="video-container">
        <iframe 
          src={episode.streaming.iframe_url}
          width="100%"
          height="500px"
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
        />
      </div>
      
      {/* Download Links */}
      <div className="download-section">
        <h3>Download</h3>
        {Object.entries(episode.download_list).map(([key, quality]) => (
          <div key={key}>
            <h4>{quality.quality} - {quality.size}</h4>
            <div className="download-links">
              {quality.download_links.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.host}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimePlayer;
```

### Python Requests

```python
import requests

BASE_URL = "http://localhost:3000/api"

# Search anime
def search_anime(query):
    response = requests.get(f"{BASE_URL}/search/{query}")
    return response.json()['data']['search_results']

# Get anime detail
def get_anime_detail(anime_id):
    response = requests.get(f"{BASE_URL}/anime/{anime_id}")
    return response.json()['data']

# Get episode
def get_episode(episode_id):
    response = requests.get(f"{BASE_URL}/eps/{episode_id}")
    return response.json()['data']

# Usage
results = search_anime('naruto')
anime = get_anime_detail(results[0]['id'])
episode = get_episode(anime['episode_list'][0]['id'])
print(episode['streaming']['iframe_url'])
```

---

## 🚀 Deploy to Vercel

### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Via GitHub

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com/)
3. Deploy otomatis!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BR1LL14N/APIotakudesu)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **HTML Parser:** Cheerio
- **HTTP Client:** Axios
- **Deployment:** Vercel

---

## 📊 Project Structure

```
otakudesu-api/
├── app.js                      # Entry point
├── package.json                # Dependencies
├── vercel.json                 # Vercel config
├── controllers/
│   ├── main.controller.js      # Home, list, search endpoints
│   └── anime.controller.js     # Detail, batch, episode endpoints
├── helpers/
│   ├── base-url.js             # Base URL configuration
│   ├── errors.js               # Error handlers
│   ├── episodeHelper.js        # Video URL extractor
│   └── image_genre.js          # Genre images
└── routes/
    └── index.js                # API routes
```

---

## ⚠️ Important Notes

### ID Format
Setiap response memiliki field `id` yang **sangat penting** untuk menentukan endpoint selanjutnya:

```javascript
// Dari complete list
{
  "id": "naruto-shippuden-sub-indo"  // ← Untuk /api/anime/:id
}

// Dari anime detail
{
  "episode_list": [
    {
      "id": "nrto-shippuden-episode-1-sub-indo"  // ← Untuk /api/eps/:id
    }
  ],
  "batch_link": {
    "id": "naruto-shippuden-batch-sub-indo"  // ← Untuk /api/batch/:id
  }
}
```

### Video URL Expiry
- **iframe_url**: Tidak expire, reliable ✅
- **direct_video_url**: Expire dalam 2-6 jam ⚠️

Untuk streaming jangka panjang, gunakan `iframe_url`.

### Rate Limiting
Gunakan API dengan bijak. Jangan spam request dalam waktu singkat untuk menghindari IP block dari website sumber.

---

## 🐛 Known Issues

- Search endpoint kadang ter-block oleh Cloudflare → Gunakan `/api/anime-list` + filter client-side
- Video URL expire setelah beberapa jam → Refresh dengan hit endpoint lagi
- Beberapa anime mungkin tidak punya batch link (ongoing anime)

---

## 🤝 Contributing

Contributions are welcome! Untuk perubahan besar, mohon buat issue terlebih dahulu.

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 TODO

- [ ] Add caching mechanism
- [ ] Add rate limiting
- [ ] Add unit tests
- [ ] Add TypeScript support
- [ ] Add GraphQL endpoint
- [ ] Add WebSocket for real-time updates
- [ ] Add database for faster search

---

## 📄 License

[MIT License](LICENSE) - Feel free to use for personal/educational purposes.

---

## 🙏 Credits

- **Website Source:** [OtakuDesu](https://otakudesu.best/)
- **Original Developer:** [BR1LL14N](https://github.com/BR1LL14N)
- **Contributors:** [List of contributors](https://github.com/BR1LL14N/APIotakudesu/graphs/contributors)

---

## 📧 Contact

For questions or support, please open an [issue](https://github.com/BR1LL14N/APIotakudesu/issues).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/BR1LL14N">BR1LL14N</a>
  
  ⭐ Star this repo if you find it useful!
</div>