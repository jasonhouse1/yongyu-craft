import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'works', 'uploads')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '未提供檔案' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '僅支援 JPG、PNG、WebP 格式' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '檔案大小不可超過 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const filepath = path.join(UPLOAD_DIR, filename)

    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/images/works/uploads/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: '上傳失敗' }, { status: 500 })
  }
}
