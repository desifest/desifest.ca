import React, { useRef } from 'react'

const VIDEOS = [
  'xJhOyQ8zUik',
  'c0vF6FJ_FHg',
  'QYBR-Ykx6Jc',
  'CPhw-lFpLsE',
  'czf4UcWwEio',
  'Gq4iFktpYqg',
  'gW3dlWT4N1Q',
  'ysOwPkr9SK0',
  '72uQW0ohf9A',
  'EPpd00VSSIQ',
]

const YoutubePlaylist = ({ videos }) => {
  const videoList = videos || VIDEOS
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .yt-section {
          position: relative;
          padding: 20px 0;
        }

        .yt-scroll-container {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 10px 50px;
          scrollbar-width: none;
        }

        .yt-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .yt-card {
          flex: 0 0 240px;
          aspect-ratio: 9 / 16;
          border-radius: 16px;
          overflow: hidden;
          scroll-snap-align: start;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }

        .yt-card:hover {
          transform: scale(1.03);
        }

        .yt-card iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .yt-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .yt-btn:hover { background: #fff; }
        .yt-btn-left { left: 6px; }
        .yt-btn-right { right: 6px; }

        @media (max-width: 600px) {
          .yt-card { flex: 0 0 160px; }
          .yt-btn { width: 34px; height: 34px; font-size: 16px; }
        }
      `}</style>

      <div className="yt-section">
        <button className="yt-btn yt-btn-left" onClick={() => scroll(-1)}>‹</button>

        <div className="yt-scroll-container" ref={scrollRef}>
          {videoList.map((id, i) => (
            <div className="yt-card" key={id}>
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={`Video ${i + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>

        <button className="yt-btn yt-btn-right" onClick={() => scroll(1)}>›</button>
      </div>
    </>
  )
}

export default YoutubePlaylist
