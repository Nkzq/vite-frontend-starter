# Vite front-end boilerplate

A frontend boilerplate using Vite, SASS, Twig, ES6 modules.
Shipped with some mixins, SVG sprite ready and images optimization.
Also great performance tools : Purge & Critical CSS.

## Requirements

* `node` : `>=16`
* `yarn` or `npm`

## Installation

```sh
$ yarn install
```
or
```sh
$ npm install
```

## Configuration

Edit the [`config.js`](config.js) according to your needs.

### Environment

* **`server`**: configure development server, specify `host`, `port`. Refer to the full development server configuration options for [`Vite server options`](https://vitejs.dev/config/#server-options).
* **`rootDir`**: project root directory (where index.html is located). Can be an absolute path, or a path relative to the location of the config file itself.
* **`buildDir`**: specify the output directory (relative to project root).

### Plugins

* **`purgecss`**: toggle PurgeCSS activation, also provide an (optional) array of classes to add to the [`safelist`](https://purgecss.com/safelisting.html)
* **`critical`**: toggle Critical CSS activation

### Images

* **`imagemin`**: an object containing the whole images optimization configuration, for more details check [`vite-plugin-imagemin`](https://github.com/vbenjs/vite-plugin-imagemin)

## Development

### Assets

* #### Styles
**SASS/PostCSS** files are located under `src/assets/scss/`

* #### JavaScript

**JavaScript** files, with support of latest ECMAScript, are located under `src/assets/js/`
Scripts are working as modules with conditionnal import using `conditioner`, see the documentation [`here`](https://github.com/rikschennink/conditioner).

Use `data-module` attribute with your corresponding JS file. You can also add context, like breakpoint and visibility, see the example below.
Hello module will be imported if the current viewport has atleast a width of 48rem (768px) and if the element is visible in the viewport.

```twig
<h1
  data-module="Hello"
  data-context="@media (min-width: 48rem) and was @visible"
>
  {{ siteTitle }}
</h1>
```

```js
// src/assets/js/modules/Hello.js
export default element => {
  // Module mounted
  console.log('Hello', element)
  return () => {
    // Module unmounted
    console.log('Bye')
  }
}
```

* #### Images

**Image** files are located under `src/assets/images/`
You can convert all your `.png` and `.jpg` images to WebP format by using this command :

```sh
$ yarn webp
```
or
```sh
$ npm run webp
```

There is a twig template located under `src/assets/templates/utils/_image.twig` which can help you.

Example with a simple image

```twig
# image.src: path to your image (required)
# image.ext: image source extension (required)
# pictureClass: Class attribute for the picture element
# image.src_2x: path to the retina version of your image
# image.webp: set webp to true if you want to use your webp image converted

{% include 'utils/_image.twig' with {
  pictureClass: 'picture',
  image: {
    src: '/assets/images/cover',
    src_2x: '/assets/images/cover@2x',
    ext: 'png',
    webp: true
    alt: 'Hero cover'
  }
} %}
```

Example with multiple breakpoints

```twig
{% include 'utils/_image.twig' with {
  pictureClass: 'picture',
  image: {
    src: '/assets/images/cover',
    src_2x: '/assets/images/cover@2x',
    ext: 'png',
    webp: true
    alt: 'Hero cover'
  },
  breakpoints: {
    768: {
      src: '/assets/images/cover-md',
      src_2x: '/assets/images/cover-md@2x',
      ext: 'png',
      webp: true
    },
    1280: {
      src: '/assets/images/cover-lg',
      src_2x: '/assets/images/cover-lg@2x',
      ext: 'png',
      webp: true
    }
  }
} %}
```

* #### Fonts

**Font** files are located under `src/assets/fonts/`

* #### Icons

**Icons** files are located under `src/assets/icons`, they are used to create a svg sprite.
Feel free to use the icon twig template to help you, it is located under : `src/assets/templates/utils/_icon.twig`

```twig
# iconID is the name of your svg file (required)

{% include 'utils/_icon.twig' with {
  iconID: 'menu'
} %}
```

* #### Lazyloading

[`Lazysizes`](https://github.com/aFarkas/lazysizes) is used to lazyload images and background images.
Simply add `lazyload` class on your image elements and `data-bg="path/to/your/background"` for background images.

* #### Twig

**Twig** files are located under `src/assets/templates`. For twig modules or components, prefix file name with `_` to avoid html conversion.

The html files located by default in the Vite project root are not intented to be replaced directly by the twig ones as the normal page files resolution/linking on the Vite's dev server is wanted to be preserved along with the build logic. However, those files are supposed to contain a json definition instead of the traditional markup, which should be moved on the twig side.

More in details, a html file should look like this:

```html
<!-- index.html -->
<script type="application/json">
  {
    "template": "path/to/template.twig",
    "data": {
      "title": "Homepage"
    }
  }
</script>
```

where template is the path of the twig template to be rendered (relative to the cwd), and data is the local context for that page (eventually merged with the globals provided via plugin options).

If you want to go deeper with data, like for internationalization. You can create JSON files associated to the langugage you want to support. JSON files are located under `src/data/{lang}.json`.

For example :

Create a JSON file to support english language : `src/data/fr.json`

```json
{
  "title": "Accueil"
}
```

Then edit `vite.config.js` to import and inject JSON to twig global data

```js
// JSON data
...
const fr = require(`./${rootDir}/data/fr.json`)

export default defineConfig ({
  ...
  plugins: [
    twig({
      globals: {
        data: {
          en,
+         fr,
        }
      }
    }),
    ...
  ],
})
```

In your html file, pass your langugage key as data

```html
<script type="application/json">
  {
    "template": "src/assets/templates/index.twig",
    "data": {
      "lang": "fr"
    }
  }
</script>
```

To finish, you can use your data according to your language

```twig
{{ data[lang].title }}
```

* #### Theming

All default theming configuration are located in `src/scss/vars/_default.scss`.
A bunch a useful mixins ready to use located under `src/scss/base/_mixins.scss`.

* ##### Fluid sizing

A SASS mixin to linear interpolation size values using calc() across multiple breakpoints. It uses some basic math behind the scenes. You don't need to know the math or understand it to use this mixin. [`Source`](https://github.com/Jakobud/poly-fluid-sizing)

Minimum and maximum size are set in `src/scss/vars/_default.scss`, they are related to the breakpoints map.
```scss
$pfs-min: map.get($breakpoints, xs);
$pfs-max: map.get($breakpoints, 2xl);
```

Usage :
```scss
@include poly-fluid-sizing('font-size', ($pfs-min: rem(18px), $pfs-max: rem(24px)));
```

* ##### Font styles

You can declare your different font styles as a map
  * `name` - name of your font style
  * `size` - font-size with no fuild sizing
    * `min` - minimum font-size with fluid sizing
    * `max` - maximum font-size with fluid sizing
  * `lh` - line-height
  * `weight` - font weight
  * `color` - color of the text

```scss
$font-styles: (
  title: (
    size: (
      min: 2rem,
      max: 4.375rem,
    ),
    lh: $heading-line-height,
    weight: 700,
  ),
  button: (
    size: 1.25rem,
    weight: 700
  )
);

// Then use fs mixin
.title {
  @include fs(title);
}
```

* ##### Colors

Like font styles, colors are also declared as a map

```scss
$colors: (
  black: (
    base: #000
  ),
  white: (
    base: #fff
  ),
  main: (
    light: #63ccff,
    base: #039be5,
    dark: #006db3,
  ),
);

// Then use setColor function, default type is "base"

.white {
  color: setColor(white);
}

.main--dark {
  background-color: setColor(main, dark);
}
```

* ##### Breakpoints

There is more map, breakpoints time !

```scss
$breakpoints: (
  xs: 22.5rem, // 360px
  sm: 30rem, // 480px
  md: 48rem, // 768px
  lg: 64rem, // 1024px
  xl: 80rem, // 1280px
  2xl: 90rem, // 1440px
);

// Then use mq mixin
.container {
  max-width: 100%;

  @include mq(lg) {
    max-width: rem(1024px);
  }
}
```

You can set `$bp-helper` to `true` in order to enable a little UI helper displayed in the bottom right of your screen.

* ##### Grid

Grid settings are located under `src/scss/vars/_default.scss`
Gutter sizes are related to breakpoints, It uses fluid sizing to calculate gutters sizing.

```scss
// Define grid inner gutter sizes
$grid-inner-gutters: (
  xs: 0.5rem, // 8px
  2xl: 1.25rem, // 20px
);

// Define grid outer gutter sizes
$grid-outer-gutters: (
  xs: 1.25rem, // 20px
  2xl: 3.125rem, // 50px
);

// Define number of grid columns
$grid-columns: 12;
// Define grid container max-width
$grid-container-width: 64rem;
```

It generates many helper classes :

* `wrapper`: Grid wrapper with `$grid-container-width` value as max-width
* `container`: Handle grid outer gutters
  * `container--relative`: Modifier to set a relative position to the container
  * `container--ng`: Modifier to remove outer gutters
* `row`: Flex container for columns
  * `row--reverse`: Reverse columns order
  * `row--full`: Break the wrapper max-width to fit the whole screen size
* `col-{number}`: A column whose width is equal no $grid-columns / {number}
* `col-{breakpoint}-{number}`: Same as above, but with a breakpoint condition
* `col-offset-{number}`: Push the columns
* `col-{breakpoint}-offset-{number}`: Same as above, but with a breakpoint condition

Example :

```twig
<div class="wrapper">
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-3">
        Full with on small viewport, half width on medium viewport and one quarter on large viewport
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        Full with on small viewport, half width on medium viewport and one quarter on large viewport
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        Full with on small viewport, half width on medium viewport and one quarter on large viewport
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        Full with on small viewport, half width on medium viewport and one quarter on large viewport
      </div>
    </div>
  </div>
</div>
```

* #### SEO Friendly

Use 2 data attributes to spread a link around an entire element. It uses `pseudo-classes` trick with absolute positioning. Be careful with relative position inside your element.
Flag the element you want to spreak your link to with `data-seo-container` then add `data-seo-target` to your `<a>` element.

Demo : [`https://codepen.io/Nkzq/pen/RwgJwzd`](https://codepen.io/Nkzq/pen/RwgJwzd)

```html
<div class="card" data-seo-container>
  <div class="card__media">
    <img src="https://picsum.photos/165/165" alt="photo placeholder">
  </div>
  <div class="card__content">
    <p class="card__category">Technology</p>
    <h2 class="card__title">
      <a href="https://romainlefort.com" class="card__link" target="_blank" data-seo-target>The companies offering delivery to the Moon</a>
    </h2>
    <p class="card__excerpt">Not many people can say they have a doctorate in interplanetary navigation, but Tim Crain can.</p>
  </div>
</div>
```

## Build Assets

### Development

Start a local development server with previous defined settings, default is `https://localhost:8000/`

```sh
$ yarn dev
```
or
```sh
$ npm run dev
```

### Production

Build all assets for production :

```sh
$ yarn build
```
or
```sh
$ npm run build
```

To include WebP images convert :

```sh
$ yarn prod
```
or
```sh
$ npm run prod
```

Preview your production build :

```sh
$ yarn preview
```
or
```sh
$ npm run preview
```

## Run Code Style Linters

### SASS

```sh
$ yarn lint:sass
```
### JavaScript

```sh
$ yarn lint:js
```

- - -

Hope you like it !
Feel free to open issues for clarification/misunderstanding documentation.