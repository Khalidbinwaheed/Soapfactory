import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { join } from 'path'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With a real filesystem (VPS, Localhost), we can verify the directory exists
  // For Vercel, this only works in /tmp, so we can't persistent save to public.
  // But for this "Soap Factory" demo request, assuming local/VPS hosting:
  
  const uploadDir = join(process.cwd(), 'public/uploads')
  
  // Ensure directory exists (basic node fs check would be good, or just try writing)
  // We'll rely on it existing or manual creation, or use mkdir.
  // Let's assume public exists. `uploads` might not.
  // To be safe, let's use fs.mkdir
  try {
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)){
          fs.mkdirSync(uploadDir, { recursive: true });
      }
  } catch (e) {
      console.error("Error ensuring upload dir", e)
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name)
  const filepath = join(uploadDir, filename)
  
  try {
      await writeFile(filepath, buffer)
      const url = `/uploads/${filename}`
      return NextResponse.json({ success: true, url })
  } catch (error) {
      console.error('Error saving file:', error)
      return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
  }
}
