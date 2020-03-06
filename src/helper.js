'use strict'
const zlib = require('zlib')
const fs = require('fs')
const Memcached = require('memcached-encoding-fork')
const hidrate = require('./hidrate')
const phpserialize = require('./phpserialize')
require('dotenv').config()

const MEMCACHED_HOST = process.env.MEMCACHED_HOST
const KEY_PREFIX = 'br_integrationproduct_'

const memcached = new Memcached(MEMCACHED_HOST, {
  zlibInflate: true
})

function setKey (key, data, memcached) {
  memcached.set(key, data, 100000)
}

function registerProduct (prod) {
  const sku = prod.skus[0]
  const urlSections = prod.url.split('-')
  const urlId = urlSections[urlSections.length - 1].replace('.html', '')
  const phpSerial = phpserialize(hidrate(prod))
  const productJson = JSON.stringify(prod)

  setKey(KEY_PREFIX + sku, productJson, memcached)
  setKey(`br_integrationurlmapping_${urlId}`, sku, memcached)
  console.log(`br_integrationurlmapping_${urlId}`, sku)
  console.log('Key created:', KEY_PREFIX + sku)
}

function compress (data) {
  console.log('Compressing')
  const bf = Buffer.from(data)
  return zlib.deflateSync(bf).toString()
}

function uncompress (data) {
  console.log('Uncompressing')
  const bf = Buffer.from(data)
  return zlib.unzipSync(bf).toString()
}

function getKey (key, memKey, memcached) {
  console.log('Getting memcached key')
  memcached.get(key, function (err, data) {
    if (err) console.error(err)
    fs.writeFileSync('./' + memKey, data)
  })
}

function setFromFile (key, path, memcached) {
  const product = fs.readFileSync(path).toString()
  setKey(key, product, memcached)
}

module.exports = {
  compress,
  uncompress,
  getKey,
  setFromFile,
  setKey,
  registerProduct
}
