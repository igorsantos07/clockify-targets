# Clockify Monthly Tracker

## Tech involved
- [Svelte][sv]: there's nothing fancier for writing frontend apps 🚀
- [SvelteKit][svk]: I guess it comes bundled, so... Well, routing is great. Not yet used to SSR, though, so that's disabled.
- [Bootstrap 5][bs5]: what I'm used to and seems more solid than SMUI (mostly because we'll need progress bars here), although React-Bootstrap is waaaay better than [sveltestrap][svstrap].
- Logo from [logo.com](https://logo.com) (surprisingly well-used domain!) ([logo admin](https://app.logo.com/dashboard/logo_5d913e73-2389-4cb6-a70a-2211dd604f2e/))
- [Sass][sass]: because it's sassy 💅
- [Axios][axios]: easy to use "fetch() replacement"
- [date-fns][date-fns]: still waiting for the Temporal API, and Luxon doesn't allow changing the start of the week yet... 🤷🏼‍
- [devalue][devalue]: a fancy little lib to better serialize data into LocalStorage, from which I got an interesting idea to serialize our own models 😎

## Developing

Once you've installed dependencies with `npm install`, start a development server with `npm run dev`, or opening it directly in the browser with `npm run dev -- --open`.

## Building

To create a production version of your app, use `npm run build`.

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

[sv]:https://svelte.dev/docs/introduction
[svk]:https://kit.svelte.dev/docs/introduction
[bs5]: https://v5.getbootstrap.com/
[svstrap]: https://sveltestrap.js.org/
[sass]: https://sass-lang.com/documentation/
[axios]: https://axios-http.com/docs/intro
[date-fns]: https://date-fns.org/docs/Getting-Started
[devalue]: https://www.npmjs.com/package/devalue
