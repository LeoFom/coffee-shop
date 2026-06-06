import ShopPage from "@/shop/page";
import {getProducts} from "@/lib/features/api/products/getProducts";

export default async function Shop() {
  const productsData = await getProducts()

  return(
    <ShopPage
      productsData={productsData}
    />
  )
}