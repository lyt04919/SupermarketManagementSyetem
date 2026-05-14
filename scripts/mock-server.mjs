import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const HOST = '127.0.0.1'
const PORT = 3001
const DB_PATH = resolve(process.cwd(), 'db.json')
const COLLECTIONS = new Set(['products', 'bills', 'suppliers'])

const jsonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
}

async function readDb() {
  const raw = await readFile(DB_PATH, 'utf8')
  const data = JSON.parse(raw)

  for (const key of COLLECTIONS) {
    if (!Array.isArray(data[key])) {
      data[key] = []
    }
  }

  return data
}

async function writeDb(data) {
  await writeFile(DB_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, jsonHeaders)
  res.end(JSON.stringify(payload))
}

function sendEmpty(res, statusCode = 204) {
  res.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end()
}

async function readBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function parsePath(urlString) {
  const url = new URL(urlString, `http://${HOST}:${PORT}`)
  const segments = url.pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return { collection: null, id: null }
  }

  const [collection, idSegment] = segments
  const id = idSegment ? Number(idSegment) : null

  return { collection, id: Number.isNaN(id) ? null : id }
}

function nextId(items) {
  return items.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1
}

const server = createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      sendJson(res, 400, { message: '无效请求' })
      return
    }

    if (req.method === 'OPTIONS') {
      sendEmpty(res, 204)
      return
    }

    const { collection, id } = parsePath(req.url)

    if (!collection) {
      sendJson(res, 200, {
        message: 'mock server is running',
        resources: [...COLLECTIONS].map((key) => `http://${HOST}:${PORT}/${key}`)
      })
      return
    }

    if (!COLLECTIONS.has(collection)) {
      sendJson(res, 404, { message: '资源不存在' })
      return
    }

    const db = await readDb()
    const items = db[collection]

    if (req.method === 'GET' && id === null) {
      sendJson(res, 200, items)
      return
    }

    if (req.method === 'GET' && id !== null) {
      const item = items.find((entry) => Number(entry.id) === id)
      if (!item) {
        sendJson(res, 404, { message: '数据不存在' })
        return
      }
      sendJson(res, 200, item)
      return
    }

    if (req.method === 'POST') {
      const payload = await readBody(req)
      const item = { ...payload, id: nextId(items) }
      items.push(item)
      await writeDb(db)
      sendJson(res, 201, item)
      return
    }

    if (id === null) {
      sendJson(res, 400, { message: '缺少数据 id' })
      return
    }

    const index = items.findIndex((entry) => Number(entry.id) === id)
    if (index === -1) {
      sendJson(res, 404, { message: '数据不存在' })
      return
    }

    if (req.method === 'PUT') {
      const payload = await readBody(req)
      const item = { ...payload, id }
      items[index] = item
      await writeDb(db)
      sendJson(res, 200, item)
      return
    }

    if (req.method === 'DELETE') {
      const [removed] = items.splice(index, 1)
      await writeDb(db)
      sendJson(res, 200, removed)
      return
    }

    sendJson(res, 405, { message: '不支持的请求方法' })
  } catch (error) {
    console.error('[mock-server error]', error)
    sendJson(res, 500, { message: '服务器内部错误' })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Mock server running at http://${HOST}:${PORT}`)
  console.log(`Using database file: ${DB_PATH}`)
})
