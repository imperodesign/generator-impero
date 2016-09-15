<img src="https://media.giphy.com/media/3o6gEaLDVsHUcmyTZe/giphy-tumblr.gif">

# <%= name %>

Built to your liking with the Impero generator with the following features: <%= cssName %>

## Quick Guide

1. Alter environment variables as desired after running: `cp .env.example .env`
2. Change the app name to something unique in each of the deploy scripts
3. Update the app and repo names in `package.json`
4. Install dependencies: `npm i`
5. Start the server: `npm run start` on by default port 5000. Note that during development mode (per environment variable) this also runs Webpack watch including HMR on said port, and on top of that BrowserSync on by default port 5001 (your chosen port for the server plus one)

You can also run `npm run devstart` to start a server identical to the above with Nodemon, providing the benefit of automatic server restarts

The build task can be run with `npm run build`
