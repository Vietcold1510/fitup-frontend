import { Image, Platform } from "react-native";

const LOCAL_WORKOUT_VIDEO = require("../../assets/scpd.mp4");
const ANDROID_ASSET_VIDEO_URI = "file:///android_asset/scpd.mp4";

const uniqueNonEmpty = (items: string[]) =>
  Array.from(new Set(items.filter((item) => typeof item === "string" && item.trim().length > 0)));

export const getWorkoutVideoSources = (): string[] => {
  const resolvedAssetUri = Image.resolveAssetSource(LOCAL_WORKOUT_VIDEO)?.uri ?? "";

  if (Platform.OS === "android") {
    // Android release can read from android_asset, while dev often needs Metro asset URI.
    return uniqueNonEmpty([ANDROID_ASSET_VIDEO_URI, resolvedAssetUri]);
  }

  return uniqueNonEmpty([resolvedAssetUri]);
};

export const buildLoopingVideoHtml = (videoSources: string[]): string => {
  const sources = JSON.stringify(uniqueNonEmpty(videoSources));

  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: #121212;
            overflow: hidden;
          }
          .wrap {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #121212;
          }
          video {
            width: 100%;
            height: 100%;
            background: #000;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <video
            id="fitup-video"
            autoplay
            loop
            muted
            playsinline
            webkit-playsinline
            preload="auto"
            controlslist="nofullscreen nodownload noplaybackrate noremoteplayback"
            disablepictureinpicture
          ></video>
        </div>
        <script>
          (function () {
            const sourceList = ${sources};
            const video = document.getElementById("fitup-video");

            if (!video || !Array.isArray(sourceList) || sourceList.length === 0) {
              return;
            }

            let currentIndex = 0;

            const tryPlay = () => {
              video.muted = true;
              const playPromise = video.play();
              if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
              }
            };

            const loadSource = (index) => {
              if (index < 0 || index >= sourceList.length) {
                return;
              }

              currentIndex = index;
              video.src = sourceList[currentIndex];
              video.load();
              tryPlay();
            };

            video.addEventListener("canplay", tryPlay);
            video.addEventListener("loadeddata", tryPlay);
            video.addEventListener("error", () => {
              if (currentIndex < sourceList.length - 1) {
                loadSource(currentIndex + 1);
              }
            });

            loadSource(0);
          })();
        </script>
      </body>
    </html>
  `;
};
