interface statistic {
  auctions: number
  users: number
  products: number
}

interface ads_banner {
  img: string
  media_type: string
  duration: number
}

export interface category {
  id: number
  name: string
  description: string | null
  image: string
  slug: string
  children: category[] | null
  circle_icon: string
  disable_shipping: 0 | 1
}

export interface categories_data {
  categories: category[]
  statistics: statistic
  ads_banners: ads_banner[]
  ios_version: number
  ios_latest_version: number
  google_version: number
  huawei_version: number
}

export interface categoryChildPropertyOption {
  id: number
  name: string
  slug: string
  parent: number
  child: false
}

export interface categoryChildProperty {
  id: number
  name: string
  description: string | null
  slug: string
  parent: number
  list: false
  type: string | null
  value: string
  other_value: string
  options: categoryChildPropertyOption[]
  choosedPropertyOption: categoryChildPropertyOption | null
  childrenIds: number[]
}

// export interface categoryChildProperties_data {}
