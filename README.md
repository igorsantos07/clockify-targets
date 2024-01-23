# Clockify Monthly Tracker

## Tech involved
- [Svelte][sv]: there's nothing fancier for writing frontend apps 🚀
- [SvelteKit][svk]: I guess it comes bundled, so... Well, routing is great. Not yet used to SSR, though, so that's disabled.
- [Bootstrap 5][bs5]: what I'm used to and seems more solid than SMUI (mostly because we'll need progress bars here), although React-Bootstrap is waaaay better than [sveltestrap][svstrap].
- Logo based on [logo.com](https://logo.com) (surprisingly well-used domain!) ([logo admin](https://app.logo.com/dashboard/logo_5d913e73-2389-4cb6-a70a-2211dd604f2e/)). It got adapted to mimick the Clockify clock arms, and thus there's no SVG available.
- [Sass][sass]: because it's sassy 💅
- [Axios][axios]: easy to use "fetch() replacement"
- [date-fns][date-fns]: still waiting for the Temporal API, and Luxon doesn't allow changing the start of the week yet... 🤷🏼‍
- [devalue][devalue]: a fancy little lib to better serialize data into LocalStorage, from which I got an interesting idea to serialize our own models 😎
- [Firebase][Firebase]: for a bunch of tools:
  - [Analytics](https://firebase.google.com/docs/analytics/get-started?platform=web)
  - [NoSQL database (Firestore)](https://firebase.google.com/docs/firestore/quickstart)
  - [Performance monitoring](https://firebase.google.com/docs/perf-mon/get-started-web)

## Developing

Once you've installed dependencies with `npm install`, start a development server with `npm run dev`, or opening it directly in the browser with `npm run dev -- --open`.

## Building

To create a production version of your app, use `npm run build`.

You can preview the production build with `npm run preview`.

## Deploying

The app is served at https://clockify-targets.web.app.

To deploy it there, use `npx firebase deploy` - although you probably don't need that, Firebase already auto-wired it to GitHub pushes and pull requests 🎉

It's also possible to emulate hosting localy: `npx firebase serve`. This will _not_ build the app previously, you still need to run `npx run build` before, if necessary.

Lastly, here's the [Firebase Console](https://console.firebase.google.com/u/0/project/clockify-targets/overview).

[sv]:https://svelte.dev/docs/introduction
[svk]:https://kit.svelte.dev/docs/introduction
[bs5]: https://v5.getbootstrap.com/
[svstrap]: https://sveltestrap.js.org/
[sass]: https://sass-lang.com/documentation/
[axios]: https://axios-http.com/docs/intro
[date-fns]: https://date-fns.org/docs/Getting-Started
[devalue]: https://www.npmjs.com/package/devalue
[Firebase]: https://firebase.google.com/
