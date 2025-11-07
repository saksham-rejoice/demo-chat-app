import ProductDetailsPage from "@/components/dashboard/ProductDetails";
import { ProductListDetails } from "@/services/productService";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await ProductListDetails(id);
  return {
    title: product.title,
    description: product.description,
  };
}

const ProductDetails = async ({params}: {params: Promise<{id: string}>}) => {
  const { id } = await params;
  const product = await ProductListDetails(id);
  return <ProductDetailsPage product={product} />;
};

export default ProductDetails;
