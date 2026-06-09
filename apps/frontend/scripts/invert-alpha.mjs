import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(__dirname, '../public/images/works/lumiere-ring/alpha.png')
const dst = path.join(__dirname, '../public/images/works/lumiere-ring/alpha-inverted.png')

await sharp(src).negate().toFile(dst)
console.log('alpha-inverted.png 已產生')
