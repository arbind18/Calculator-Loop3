import type { NextRequest } from 'next/server'
import { proxy } from './src/proxy'

export default function middleware(request: NextRequest) {
  return proxy(request)
}

export { config } from './src/proxy'
