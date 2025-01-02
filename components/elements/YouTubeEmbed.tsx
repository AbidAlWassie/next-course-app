import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  autoplay?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
  rel?: boolean;
  start?: number;
  end?: number;
  loop?: boolean;
  mute?: boolean;
  playsinline?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  autoplay = false,
  controls = true,
  modestbranding = false,
  rel = false,
  start = 0,
  end,
  loop = false,
  mute = false,
  playsinline = true,
}) => {
  const params = [
    `autoplay=${autoplay ? 1 : 0}`,
    `controls=${controls ? 1 : 0}`,
    `modestbranding=${modestbranding ? 1 : 0}`,
    `rel=${rel ? 1 : 0}`,
    start ? `start=${start}` : '',
    end ? `end=${end}` : '',
    loop ? `loop=1&playlist=${videoId}` : '',
    mute ? `mute=1` : '',
    `playsinline=${playsinline ? 1 : 0}`,
  ]
    .filter((param) => param)
    .join('&');

  const src = `https://youtube.com/embed/${videoId}?${params}`;

  return (
    <div className="iframe-container">
      <iframe
        className="ytplayer video"
        title="Youtube player"
        sandbox="allow-same-origin allow-scripts"
        src={src}
        allowFullScreen
        style={{ width: '100%', height: '100%' }}
      ></iframe>
      <div className="iframe-overlay"></div>
    </div>
  );
};

export default YouTubeEmbed;
