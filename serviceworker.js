const VERSION = "v1";
const CACHE_NAME = `stats-tracker-${VERSION}`;


const APP_STATIC_RESOURCES = [
	"/StatTracker/",
	"/StatTracker/index.html",
	"/StatTracker/style.css",
	"/StatTracker/StatTrackerIcon.png",
	"/StatTracker/game.html",
	"/StatTracker/manifest.json",
	"/StatTracker/newGame.html",
	"/StatTracker/newPlayer.html",
	"/StatTracker/newTeam.html",
	"/StatTracker/viewGames.html",
	"/StatTracker/viewPlayers.html",
	"/StatTracker/viewTeam.html",
	"/StatTracker/script.js",
	"/StatTracker/scriptNewGame.js",
	"/StatTracker/scriptNewPlayer.js",
	"/StatTracker/scriptNewTeam.js",
	"/StatTracker/scriptViewGames.js",
	"/StatTracker/scriptViewPlayers.js",
	"/StatTracker/scriptViewTeam.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll(APP_STATIC_RESOURCES);
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

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
/*self.addEventListener("fetch", (event) => {
  // As a single page app, direct app to always go to cached home page.
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"));
    return;
  }

  // For all other requests, go to the cache first, and then the network.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // If resource isn't in the cache, return a 404.
      return new Response(null, { status: 404 });
    })(),
  );
});*/

/*self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found, otherwise fetch from network
      return cachedResponse || fetch(event.request);
    }).catch((error) => {
      console.error("Fetch failed:", error);
      // Optional: return fallback page here
      return new Response("Offline and resource not cached.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/plain" },
      });
    })
  );
});*/
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        // Try to fallback to the root HTML (good for SPAs)
        return caches.match("/index.html").then((fallback) => {
          return fallback || new Response("Offline and page not cached", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });
      })
    );
    return;
  }

  // Handle other requests (scripts, styles, images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      return new Response("Offline and resource not cached.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    })
  );
});
