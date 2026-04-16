import { Image, Platform } from "react-native";

/**
 * The require path is relative to this file. 
 * Ensure scpd.mp4 exists in apps/mobile/assets/
 */
const LOCAL_WORKOUT_VIDEO = require("../../assets/scpd.mp4");

// On Android, assets placed in src/main/assets are accessed via this prefix
const ANDROID_ASSET_VIDEO_URI = "file:///android_asset/scpd.mp4";

const uniqueNonEmpty = (items: (string | undefined | null)[]) =>
  Array.from(
    new Set(
      items.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    )
  );

/**
 * Resolves the video source based on the Platform.
 * Provides a fallback array to handle Metro (Dev) vs Local Assets (Release).
 */
export const getWorkoutVideoSources = (): string[] => {
  const resolvedAsset = Image.resolveAssetSource(LOCAL_WORKOUT_VIDEO);
  const resolvedUri = resolvedAsset?.uri ?? "";

  if (Platform.OS === "android") {
    // Priority 1: The 'file:///android_asset' path (fastest for Release builds)
    // Priority 2: The resolved URI (handles Metro bundler in Dev)
    return uniqueNonEmpty([ANDROID_ASSET_VIDEO_URI, resolvedUri]);
  }

  return uniqueNonEmpty([resolvedUri]);
};

/**
 * Generates the HTML string for the WebView.
 * Includes a fallback-on-error script to cycle through sourceList.
 */
export const buildLoopingVideoHtml = (videoSources: string[]): string => {
  const sources = JSON.stringify(uniqueNonEmpty(videoSources));

  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <style>
          html, body {
            margin: 0; padding: 0;
            width: 100%; height: 100%;
            background: #121212;
            overflow: hidden;
          }
          .wrap {
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
          }
          video {
            width: 100%; height: 100%;
            object-fit: cover; /* Ensures video fills the container nicely */
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
            disablePictureInPicture
            controlslist="nofullscreen nodownload noplaybackrate noremoteplayback"
          ></video>
        </div>
        <script>
          (function () {
            const sourceList = ${sources};
            const video = document.getElementById("fitup-video");
            let currentIndex = 0;

            if (!video || !sourceList.length) return;

            const loadSource = (index) => {
              if (index >= sourceList.length) return;
              currentIndex = index;
              video.src = sourceList[currentIndex];
              
              // We call load() and play() to ensure the bridge triggers
              video.load();
              const playPromise = video.play();
              if (playPromise) {
                playPromise.catch(e => console.log("Autoplay blocked or load failed:", e));
              }
            };

            // If a source fails (like the android_asset path in Dev), try the next one
            video.addEventListener("error", () => {
              console.log("Failed to load source:", sourceList[currentIndex]);
              loadSource(currentIndex + 1);
            });

            // Initial load
            loadSource(0);
          })();
        </script>
      </body>
    </html>
  `;
};