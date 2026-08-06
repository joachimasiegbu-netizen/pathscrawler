// Client-side share-card generator. No image service, no upload - draws a
// 1200x630 canvas (standard social preview size) in memory and returns a PNG
// data URL for ResultPage's "shareable result card".

export interface ShareImageOptions {
  title: string
  subtitle: string
  footerUrl: string
}

export function generateShareImageDataUrl({ title, subtitle, footerUrl }: ShareImageOptions): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const gradient = ctx.createLinearGradient(0, 0, 1200, 630)
  gradient.addColorStop(0, '#2C5FD6')
  gradient.addColorStop(1, '#142866')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 630)

  // Logo badge
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(120, 120, 46, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2C5FD6'
  ctx.font = 'bold 48px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('P', 120, 126)

  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '600 28px sans-serif'
  ctx.fillText('PATHSCRAWLER', 190, 108)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 56px sans-serif'
  wrapText(ctx, title, 100, 280, 1000, 66)

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '32px sans-serif'
  wrapText(ctx, subtitle, 100, 420, 1000, 42)

  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(100, 520)
  ctx.lineTo(1100, 520)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '600 28px sans-serif'
  ctx.fillText(footerUrl, 100, 570)

  return canvas.toDataURL('image/png')
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let cursorY = y

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY)
      line = word
      cursorY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY)
  }
}
