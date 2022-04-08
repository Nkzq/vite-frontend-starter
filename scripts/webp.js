import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

(async () => {
	await imagemin(['src/assets/images/*.{jpg,png}'], {
		destination: 'src/assets/images/',
		plugins: [
			imageminWebp({
        quality: 50
      }),
		],
	}),

	console.log('Images converted to webp 🏞')
})()