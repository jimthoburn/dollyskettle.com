
# Dolly’s Kettle _beta_

A static web site, generated with data from the WordPress API.

This is a work in progress 🚧 

I’m using it to practice with new tools, and to help a family member who’s publishing recipes & pictures 🍎 🖼

If you’d like to re-use this code to make your own web site based on WordPress, the basic steps are…

1. Install [Deno](https://deno.com/runtime) (version `1.43.6` or greater).

2. Edit the URLs in `_config.js` so they point to your WordPress installation

3. Delete the example data in `_api` and `_pictures`

4. Update the layouts and styles to your liking

5. From the root of your project, generate the site...

```shell
deno task build
```

This will create a folder called `_site` that you can publish to a static host like [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com).

## Running locally

You can test the site locally by running...

```shell
deno task dev
```

## Project goals

This project is an experiment to see how easily a web site can be created with the benefits of both a CMS (like WordPress) and static site (like Jekyll)…

- [x] Content can be created and updated with an easy-to-use CMS, like WordPress
- [x] Changes to the content are versioned with a tool like Git
- [x] The web site can be continuously deployed in a way that is reliable, scalable and secure
- [x] The CMS can be hosted separately from the site, with limited access
- [x] The web site is still available, even if something goes wrong in the CMS

## Helpful resources

These projects and guides have been super helpful, while working on this…

* https://www.smashingmagazine.com/2020/02/headless-wordpress-site-jamstack/
* https://hacks.mozilla.org/category/es6-in-depth/
* https://github.com/developit/htm
* https://www.pika.dev/

## License

The code for this project (except for the recipes, photos and other content) is available under an [open source license](https://github.com/jimthoburn/dollyskettle.com/blob/master/LICENSE).
