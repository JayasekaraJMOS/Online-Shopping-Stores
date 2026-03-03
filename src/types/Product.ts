export interface Product {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  rating?: number
  stock?: number
  discountPercentage?: number
  sku?: string
  brand?: string
  reviews?: Review[]
  images?: string[]
  oldPrice?: string
  discount?: number
}

export interface Review {
  rating: number
  comment: string
  date?: string
  reviewerName: string
  reviewerEmail?: string
}