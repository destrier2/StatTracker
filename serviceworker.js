const VERSION = "v1";
const CACHE_NAME = 'stats-tracker-${VERSION}';

const APP_STATIC_RESOURCES = [
	"/",
	"/index.html",
	"/style.css",
	"/StatTrackerIcon.png",
	"game.html",
	"manifest.json",
	"newGame.html",
	"newPlayer.html",
	"newTeam.html",
	"viewGames.html",
	"viewPlayers.html",
	"viewTeam.html",
	"script.js",
	"scriptNewGame.js",
	"scriptNewPlayer.js",
	"scriptNewTeam.js",
	"scriptViewGames.js",
	"scriptViewPlayers.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return undefined;
        }),
      );
      await clients.claim();
    })(),
  );
});

