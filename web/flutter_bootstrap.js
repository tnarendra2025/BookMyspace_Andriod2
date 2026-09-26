/**
 * BookMySpace Web Bootstrap
 *
 * Boots the real Flutter web application (main.dart.js) via the standard
 * Flutter loader.
 *
 * History: this file previously rendered a hand-written static HTML shell
 * (venue grid, navbar, category pills) and never started the Dart app, so
 * `flt-glass-pane` / the Flutter engine never appeared in the browser.
 * All of that markup has been removed.
 *
 * The legitimate BookMySpace web concerns live in web/index.html and are
 * unaffected by this file:
 *   - Google Maps JS API key
 *   - Web Push service-worker bridge (sw.js)
 *   - Web Speech / voice search bridge
 *   - PWA meta tags, manifest and base-href handling
 */
{{flutter_js}}
{{flutter_build_config}}

// Load the Flutter application entrypoint (runs main() -> runApp()).
_flutter.loader.load({
  serviceWorkerSettings: {
    serviceWorkerVersion: {{flutter_service_worker_version}},
  },
});
