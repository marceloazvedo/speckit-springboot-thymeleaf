export function uuidv7(): string {
  const ts = Date.now()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  bytes[0] = Math.floor(ts / 2 ** 40) & 0xff
  bytes[1] = Math.floor(ts / 2 ** 32) & 0xff
  bytes[2] = Math.floor(ts / 2 ** 24) & 0xff
  bytes[3] = Math.floor(ts / 2 ** 16) & 0xff
  bytes[4] = Math.floor(ts / 2 ** 8) & 0xff
  bytes[5] = ts & 0xff
  bytes[6] = 0x70 | (bytes[6] & 0x0f)
  bytes[8] = 0x80 | (bytes[8] & 0x3f)

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-')
}

export function now(): string {
  return new Date().toISOString()
}
