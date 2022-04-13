const config = {
  baseURL: 'https://localhost:8000/',
  server: {
    host: 'localhost',
    port: 8000,
  },
  rootDir: 'src',
  buildDir: 'dist',
  purgecss: {
    enable: true,
    safeList: [],
  },
  critical: {
    enable: true,
  },
  htmlMinify: {
    enable: true,
    options: {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    },
  },
  imagemin: {
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    webp: {
      quality: 75,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  },
  // favicons: {
  //   background: '#ddd',
  //   theme_color: '#333',
  //   icons: {
  //     coast: false,
  //     yandex: false
  //   },
  // },
}

export default config