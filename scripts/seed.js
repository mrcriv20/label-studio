/**
 * Seed script — injects one sample product into the JSON database.
 * Run after first app launch (so the userData directory exists):
 *   node scripts/seed.js
 */
const { join } = require('path')
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs')
const os = require('os')

const platform = process.platform
let userDataDir
if (platform === 'darwin') {
  userDataDir = join(os.homedir(), 'Library/Application Support/label-studio')
} else if (platform === 'win32') {
  userDataDir = join(process.env.APPDATA || os.homedir(), 'label-studio')
} else {
  userDataDir = join(os.homedir(), '.config/label-studio')
}

// Create userData dir if it doesn't exist
mkdirSync(userDataDir, { recursive: true })

const dbPath = join(userDataDir, 'products.json')
console.log('Database path:', dbPath)

const sampleProduct = {
  id: 'seed-fresh-mozzarella-001',
  name: 'Fresh Mozzarella',
  price: '$9.99/lb',
  barcodeValue: '112000000008',
  barcodeType: 'CODE128',
  barcodeImagePath: null,
  templateId: 'avery5821',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

let db = { products: [] }
if (existsSync(dbPath)) {
  try {
    db = JSON.parse(readFileSync(dbPath, 'utf8'))
  } catch {
    db = { products: [] }
  }
}

// Only add if not already seeded
const exists = db.products.some((p) => p.id === sampleProduct.id)
if (!exists) {
  db.products.push(sampleProduct)
  writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8')
  console.log('✓ Seeded product: Fresh Mozzarella @ $9.99/lb')
} else {
  console.log('ℹ  Sample product already exists — skipping.')
}
