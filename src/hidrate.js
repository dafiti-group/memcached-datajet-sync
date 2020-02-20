'use strict'
const MATERIALS = ['Algodao', 'Couro', 'Courolegitimo', 'Borracha', 'Tecido', 'Plástico', 'Nylon', 'Polyester']

const randUntil = (bound = 1) => {
  return String(Math.round(Math.random() * bound))
}

const randArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const buildCategories = (categories, categoriesId, store) => {
  const outCategories = []
  const out = {}

  categories.forEach((c, key) => {
    const appendCat = {}

    if (categoriesId) appendCat.id_catalog_category = categoriesId[key]

    appendCat.name = c.Name
    appendCat.name_en = c.Name
    appendCat.url_key = c.slug
    appendCat.lft = '12'
    appendCat.rgt = '13'

    outCategories.push(appendCat)
  })

  out[store] = outCategories
  return out
}

const buildSKUs = (skus, sizes) => {
  const out = {}
  skus.forEach((v, k) => {
    if (!v || !sizes[k]) return
    const sku = {}
    sku.attributes = { erp_id: randUntil(9999999) }
    sku.meta = {
      sku: v,
      quantity: randUntil(9999),
      barcode_ean: randUntil(9999999999),
      size: sizes[k],
      box_height: '0.300',
      box_width: '0.300',
      box_length: '0.300',
      weight: '1.000',
      transport_type: 'Leve',
      is_no_product: '0'
    }

    out[v] = sku
  })

  return out
}

const buildAttributes = (attr) => {
  const out = {}
  attr.forEach(v => {
    out[v.name] = v.value
  })

  return out
}

const buildImages = (imgs) => {
  const out = []

  imgs.forEach((i, k) => {
    out.push({
      image: String(k + 1),
      main: String(!k ? 1 : 0),
      still: String(!k ? 1 : 0),
      original_filename: i.concat('.jpg'),
      url: i
    })
  })
  return out
}

const buildNewCategories = (ids) => {
  const out = []
  if (ids) {
    ids.forEach((id, k) => {
      if (ids[k + 1]) out.push([parseInt(id), parseInt(ids[k + 1])])
    })
  }

  return JSON.stringify(out)
}

// oque é image Sprite

const hidrate = (dp) => {
  try {
    dp.attributes = buildAttributes(dp.attributes)
    dp.categories_tree = buildCategories(dp.categories, dp.attributes.categories_ids, '1')
    dp.new_categories = buildNewCategories(dp.attributes.categories_ids)
    dp.images = buildImages(dp.images)
    dp.simples = buildSKUs(dp.skus, dp.attributes.size)

    const product = {
      attributes: {
        upper_material: randArray(MATERIALS),
        inner_material: randArray(MATERIALS),
        sole_material: randArray(MATERIALS),
        inner_sole_material: randArray(MATERIALS),
        leather_type: randUntil(),
        eco_friendly: randUntil(),
        cushioning: randUntil(),
        waterproof: randUntil(),
        breathable: randUntil(),
        isolation: randUntil(),
        windproof: randUntil()
      },
      meta: {
        sku: dp.skus[0],
        id_catalog_config: randUntil(99999),
        attribute_set_id: randUntil(13),
        name: dp.title,
        price: String(dp.price.previous),
        activated_at: '2019-08-02 12:42:54',
        cost: randUntil(9999),
        is_no_product: randUntil(),
        is_presale: 'false',
        fk_shipment_type: randUntil(100),
        stores: '1',
        grouped_products: dp.skus[0],
        categories_1: dp.attributes.categories_ids ? dp.attributes.categories_ids.join('|') : '',
        brand: dp.brand.Name,
        id_seller: randUntil(99999),
        id_brand: randUntil(99999),
        brand_url_key: dp.brand.Slug,
        tax_percent: String(dp.discount),
        gender: dp.attributes.gender[0],
        season: 'SemTemporada',
        color_name_brand: 'NAO DEFINIDA',
        color_family: 'Incolor',
        is_gift: '0',
        shipment_type: 'Marketplace',
        is_multivolume: '0',
        new_categories_1: dp.new_categories
      },
      meta_filters: [
        'activity',
        'barcode_ean',
        'brand',
        'color_family',
        'gender',
        'highlight_1',
        'highlight_2',
        'name',
        'price',
        'season',
        'special_price',
        'platform_height',
        'shaft_height',
        'shaft_width',
        'siz'
      ],
      categories: dp.categories_tree,
      simples: dp.simples,
      images: dp.images,
      image: dp.image_path,
      sprite: dp.image_path.concat('-sprite.jpg'),
      link: dp.url
    }

    if ('model' in dp.attributes) product.attributes.model = dp.attributes.model[0]
    if ('color' in dp.attributes) product.attributes.color = dp.attributes.color[0]
    if ('short_description' in dp.attributes) product.attributes.description = dp.attributes.short_description[0]
    if ('config_erp_id' in dp.attributes) product.attributes.config_erp_id = dp.attributes.config_erp_id[0]
    if ('erp_fifth_department_level' in dp.attributes) product.attributes.erp_fifth_department_level = dp.attributes.erp_fifth_department_level[0]

    return product
  } catch (e) {
    console.error(e, JSON.stringify(dp))
  }
}

module.exports = hidrate
