const { Hawk } = require('./Datajet')
const { setKey } = require('./helper')
const hidrate = require('./hidrate')
const Memcached = require('memcached-encoding-fork')

require('dotenv').config()

const MEMCACHE_PREFIX = 'br_integrationproduct_'
const MEMCACHED_HOST = process.env.MEMCACHED_HOST
const QUERY = process.argv[2]
const BODY = `{"query":"${QUERY}","dum":{"strategy":"merge","threshold":"10000"},"facets":{"limit":1000,"names":["brand","gender","special_price","upper_material","inner_material","sole_material","trodden_type","size","color_family","occasion","heel_shape","heel_height","shaft_height","shaft_width","platform_height","tip_shape","is_outlet","productline","uppermaterial","innermaterial","solematerial","collar_height","country_teams","signature_product","product_line","composition","product_type","spec_tech_spo","tipodecabelopele","caracteristicadapele","horariodeuso","fatordeprotecao","familiaolfativa","occasion_2","typeofmattress","function","capacity","age","neckline","national_teams","international_teams","washing_type","hair_type","hair_treatment","discount","is_outlet_shop_in_shop","flavor","is_presale","volt","patterning","character","color_lens","lens_treatment","model_filter","material_frame","color_frame","color_side_arms","additional_ship_days","quality","finding","brand","gender","color","size","categories_ids","owner"]},"stats":["price","price","discount"],"size":800,"category_tree_depth":6,"CurrentCategoryId":"","category_facet_mode":"hierarchy","top_product_ids":[]}`

if (!MEMCACHED_HOST) {
  throw new Error('Invalid for memcached:', MEMCACHED_HOST)
}

if (!QUERY) {
  throw new Error('Invalid query param.')
}

console.log(`Starting memcached population for "${QUERY}"`)
const hk = new Hawk({
  user: process.env.HAWK_USER,
  pass: process.env.HAWK_PASS,
  clientConfig: process.env.HAWK_CLIENT_CONFIG
})

const memcached = new Memcached(MEMCACHED_HOST, {
  encoding: 'binary',
  zlibInflate: true
})

hk.search(BODY).then(res => {
  if (!res.results) {
    console.error('Error', res)
    return
  }
  console.log('Found ', res.count, 'results')
  Object.keys(res.results).forEach((v, k) => {
    const product = res.results[v]
    const memcachedKey = hidrate(product)
    const linkParts = memcachedKey.link.split('-')
    const pid = linkParts[linkParts.length - 1].split('.')[0]
    setKey(MEMCACHE_PREFIX + memcachedKey.meta.sku, JSON.stringify(memcachedKey), memcached, (error) => {
      if (!error) {
        console.log('br_integrationurlmapping_' + pid, memcachedKey.meta.sku)
      } else {
        console.log(error)
      }
    })
    setKey('br_integrationurlmapping_' + pid, memcachedKey.meta.sku, memcached, (error) => {
      if (!error) {
        console.log('populating', memcachedKey.meta.sku)
      } else {
        console.log(error)
      }
    })
  })
}).catch(console.error)
