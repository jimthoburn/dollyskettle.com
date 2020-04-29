
# Dolly’s Kettle _beta_

A static site generated with data from the WordPress API, and published with Netlify.

[![Netlify Status](https://api.netlify.com/api/v1/badges/1e26749f-d049-4396-9099-bfa8905c9f67/deploy-status)](https://app.netlify.com/sites/staging-dollyskettle-com/deploys)

This is a work in progress 🚧 

I’m using it to practice with new tools and to share recipes and pictures 🍎 🖼

If you’d like to re-use this code to make your own web site based on WordPress, the basic steps are…

1. Install [Node.js](https://nodejs.org)
2. Edit the URLs in `_config.js` so they point to your WordPress installation
3. Install the project’s dependencies

```
$ npm install
```

4. Generate the site

```
$ npm run build
```

This will create a folder called `_site` that can be published on any host, including [Netlify](https://www.netlify.com/).

## Project goals

This project is an experiment to see how easily the following goals can be achieved…

- [x] Content can be created and updated with an easy-to-use CMS
- [ ] Changes to the content are versioned with Git
- [ ] The application can be continuously deployed in a way that is reliable, scalable and secure
- [ ] The web site is still available, even if something goes wrong in the CMS

## License

The code for this project is available under an [open source license](https://github.com/jimthoburn/dollyskettle.com/blob/master/LICENSE). The recipes, photos and other content are not included in this license.
