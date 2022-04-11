const config = {
  baseURL: 'https://localhost:8000/',
  server: {
    host: 'localhost',
    port: 8000,
    https: true,
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
  }
}

export default config