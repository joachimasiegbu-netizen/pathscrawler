// Checks every external URL the app links out to.
//
// Run with `npm run check:links`. Deliberately NOT part of CI: these are
// other people's servers, and a rate limit or a slow government site would
// turn a red build into noise that nobody trusts. Internal links are checked
// in CI instead, by tests/links.spec.ts.
//
// Exit code is 1 if anything looks genuinely broken (DNS failure, 404, 410),
// 0 otherwise. Redirects, 401/403 and timeouts are reported but do not fail
// the run: a 403 is usually a bot filter rather than a dead page, and many of
// these are .gov.uk pages that rate-limit anything scripted.

import { readdir, readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = new URL('../src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json'])
const CONCURRENCY = 8
const TIMEOUT_MS = 15000

/** Hosts that appear in source as identifiers rather than links people click:
 * XML namespaces, schema vocabularies, our own origin, and the font CDN that
 * index.html loads directly. */
const SKIP = [
  'www.w3.org',
  'schema.org',
  'pathscrawler.vercel.app',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'example.com',
  'localhost',
]

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (EXTENSIONS.has(extname(entry.name))) yield full
  }
}

async function collectUrls() {
  // Trailing punctuation is stripped because these live inside string
  // literals and prose: "see https://gov.uk/thing." should not check "thing.".
  const pattern = /https?:\/\/[^\s"'`)<>\\]+/g
  const found = new Map() // url -> Set<file>

  for await (const file of walk(ROOT)) {
    const text = await readFile(file, 'utf8')
    for (const match of text.matchAll(pattern)) {
      const url = match[0].replace(/[.,;:!?]+$/, '')
      let host
      try {
        host = new URL(url).hostname
      } catch {
        continue
      }
      if (SKIP.some((skip) => host === skip || host.endsWith(`.${skip}`))) continue
      if (!found.has(url)) found.set(url, new Set())
      found.get(url).add(file.slice(ROOT.length))
    }
  }
  return found
}

async function probe(url) {
  const options = {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // Some sites serve a different (or no) response to an obvious bot.
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; PathScrawler link check)' },
  }
  try {
    // HEAD first - cheap, and most servers support it. A 405 or a 404 from a
    // HEAD is not conclusive, so fall through to GET before believing it.
    const head = await fetch(url, { ...options, method: 'HEAD' })
    if (head.ok) return { status: head.status }
    const get = await fetch(url, { ...options, method: 'GET' })
    return { status: get.status }
  } catch (error) {
    try {
      const get = await fetch(url, { ...options, method: 'GET' })
      return { status: get.status }
    } catch (retryError) {
      return { status: 0, error: retryError.name === 'TimeoutError' ? 'timeout' : retryError.message }
    }
  }
}

async function run() {
  const found = await collectUrls()
  const urls = [...found.keys()].sort()
  console.log(`Checking ${urls.length} external URLs from src/ …\n`)

  const broken = []
  const warned = []
  let done = 0

  const queue = [...urls]
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
      const { status, error } = await probe(url)
      done += 1
      process.stdout.write(`\r  ${done}/${urls.length}`)

      const where = [...found.get(url)].join(', ')
      if (status === 404 || status === 410 || (status === 0 && error !== 'timeout')) {
        broken.push({ url, status: status || error, where })
      } else if (status === 0 || status >= 400) {
        warned.push({ url, status: status || error, where })
      }
    }
  })
  await Promise.all(workers)
  process.stdout.write('\r')

  if (warned.length) {
    // Grouped by host, not listed one by one. The careers data links to the
    // same few course sites hundreds of times, and every one of them answers
    // 403 to a script while working fine in a browser - printing 236 near
    // identical Udemy lines buries the one entry that actually matters.
    const byHost = new Map()
    for (const warning of warned) {
      const host = new URL(warning.url).hostname
      if (!byHost.has(host)) byHost.set(host, [])
      byHost.get(host).push(warning)
    }
    console.log(`\n${warned.length} to look at by hand, across ${byHost.size} hosts:`)
    for (const [host, entries] of [...byHost].sort((a, b) => b[1].length - a[1].length)) {
      const statuses = [...new Set(entries.map((entry) => entry.status))].join(', ')
      console.log(`  ${host} - ${entries.length} url${entries.length === 1 ? '' : 's'} [${statuses}]`)
      // One example is enough to go and try it in a browser; the rest of the
      // host's URLs differ only by query string.
      console.log(`      e.g. ${entries[0].url}`)
      if (entries.length === 1) console.log(`      ${entries[0].where}`)
    }
  }

  if (broken.length) {
    console.log(`\n${broken.length} BROKEN:`)
    for (const { url, status, where } of broken) console.log(`  [${status}] ${url}\n      ${where}`)
    console.log('')
    process.exitCode = 1
    return
  }

  console.log(`\nNo dead links. ${urls.length} checked, ${warned.length} flagged for a human.\n`)
}

run()
