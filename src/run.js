'use strict'
const { Hawk } = require('./Datajet')
const { registerProduct, setKey } = require('./helper')
const fs = require('fs')
const phpserialize = require('./phpserialize')
const phpunserialize = require('phpunserialize')
const Memcached = require('memcached-encoding-fork')

require('dotenv').config()

const QUERY = ''
const MEMCACHED_HOST = process.env.MEMCACHED_HOST
// const BODY = `{"query":"${QUERY}","dum":{"strategy":"merge","threshold":"10000"},"facets":{"limit":1000,"names":["brand","gender","special_price","upper_material","inner_material","sole_material","trodden_type","size","color_family","occasion","heel_shape","heel_height","shaft_height","shaft_width","platform_height","tip_shape","is_outlet","productline","uppermaterial","innermaterial","solematerial","collar_height","country_teams","signature_product","product_line","composition","product_type","spec_tech_spo","tipodecabelopele","caracteristicadapele","horariodeuso","fatordeprotecao","familiaolfativa","occasion_2","typeofmattress","function","capacity","age","neckline","national_teams","international_teams","washing_type","hair_type","hair_treatment","discount","is_outlet_shop_in_shop","flavor","is_presale","volt","patterning","character","color_lens","lens_treatment","model_filter","material_frame","color_frame","color_side_arms","additional_ship_days","quality","finding","brand","gender","color","size","categories_ids","owner"]},"stats":["price","price","discount"],"size":800,"category_tree_depth":6,"CurrentCategoryId":"","category_facet_mode":"hierarchy","top_product_ids":[]}`
const BODY = '{"query":"CA278ACF28XAH","dum":{"strategy":"merge","threshold":"10000"},"facets":{"limit":1000,"names":["brand","gender","special_price","upper_material","inner_material","sole_material","trodden_type","size","color_family","occasion","heel_shape","heel_height","shaft_height","shaft_width","platform_height","tip_shape","is_outlet","productline","uppermaterial","innermaterial","solematerial","collar_height","country_teams","signature_product","product_line","composition","product_type","spec_tech_spo","tipodecabelopele","caracteristicadapele","horariodeuso","fatordeprotecao","familiaolfativa","occasion_2","typeofmattress","function","capacity","age","neckline","national_teams","international_teams","washing_type","hair_type","hair_treatment","discount","is_outlet_shop_in_shop","flavor","is_presale","volt","patterning","character","color_lens","lens_treatment","model_filter","material_frame","color_frame","color_side_arms","additional_ship_days","quality","finding","brand","gender","color","size","categories_ids","owner"]},"stats":["price","price","discount"],"size":1,"category_tree_depth":6,"CurrentCategoryId":"","category_facet_mode":"hierarchy","top_product_ids":[]}'

console.log(`Starting memcached population for "${QUERY}"`)
const hk = new Hawk({
  user: process.env.HAWK_USER,
  pass: process.env.HAWK_PASS,
  clientConfig: process.env.HAWK_CLIENT_CONFIG
})

hk.search(BODY).then(res => {

  if (!res.results) {
    console.error('Error', res)
    return
  }

  console.log('Found ', res.count, 'results')
  res.results.map(registerProduct)
  console.log('Finished!')
})

// const product = JSON.parse(fs.readFileSync("./products/HO616ACM69WQO.json").toString())

// const memcached = new Memcached(MEMCACHED_HOST, {
//   encoding: 'binary',
//   zlibInflate: true
// })
// console.log(MEMCACHED_HOST)
// console.log(phpserialize(product))
// setKey('br_integrationproduct_CA278ACF28XAH', phpserialize(product), memcached)
