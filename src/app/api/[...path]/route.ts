import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080'

async function proxy(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/')
  const search = req.nextUrl.search
  const url = `${BACKEND}/api/${path}${search}`

  const headers = new Headers(req.headers)
  headers.set('ngrok-skip-browser-warning', 'true')
  headers.delete('host')

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    cache: 'no-store',
    // @ts-ignore
    duplex: 'half',
  })

  const data = await res.arrayBuffer()
  // Responses with these statuses must have a null body (Fetch spec) — passing
  // even an empty ArrayBuffer here throws inside NextResponse's constructor.
  const noBody = res.status === 204 || res.status === 205 || res.status === 304
  return new NextResponse(noBody ? null : data, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
  })
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params)
}
