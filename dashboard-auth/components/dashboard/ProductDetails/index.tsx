import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ProductDetailsPage = ({ product }: { product: any }) => {
  return (
    <div className="w-full p-6">
      <div className="flex gap-6">
        <div className="flex flex-col gap-2 w-20">
          {product.images?.slice(0, 4).map((image: string, index: number) => 
            image ? (
              <div
                key={index}
                className="w-16 h-16 border rounded overflow-hidden cursor-pointer border-gray-300"
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null
          )}
        </div>

        <div className="flex-1 max-w-md">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-96 object-contain rounded-lg border"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg border flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">₹{product.price}</div>
            {product.discountPercentage && (
              <div className="text-sm text-gray-500">
                MRP ₹
                {(
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toFixed(0)}
                <span className="text-green-600 ml-2">
                  <Badge variant="outline" className="ml-1">
                    Save ₹
                    {(
                      product.price / (1 - product.discountPercentage / 100) -
                      product.price
                    ).toFixed(0)}
                  </Badge>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {product.tags?.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <div className="font-semibold">Brand: {product.brand}</div>
                <div className="text-sm text-gray-500">
                  Stock: {product.stock} | Weight: {product.weight}g
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <div className="font-semibold">SKU: {product.sku}</div>
                <div className="text-sm text-gray-500">
                  {product.warrantyInformation} | {product.shippingInformation}
                </div>
              </div>
            </div>
          </div>

          <div className="font-medium">
            {product.availabilityStatus} | {product.returnPolicy}
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700">
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 border border-gray-900 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

// "use client";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import { Product } from "@/types/product";
// import { ProductListDetails } from "@/services/productService";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Rating } from "@/components/ui/rating";
// import ProductDetailsSkeleton from "./ProductDetailsSkeketion";
// import ProductDetailsReviews from "./ProductDetailsReviews";
// import ProductNotFound from "./ProductNotFound";
// import { addItemToCart } from "@/services/addToCartService";

// const ProductDetailsPage = () => {
//   const params = useParams();
//   const { id } = params;
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState<string>("");

//   const handleAddToCart = async () => {
//     if (product) {
//       try {
//         await addItemToCart(product);
//       } catch (error) {
//         console.error('Error adding to cart:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const data = await ProductListDetails(id as string);
//         setProduct(data);
//         setSelectedImage(data.thumbnail);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   if (loading) return <ProductDetailsSkeleton />;
//   if (!product) {
//     return <ProductNotFound />;
//   }

//   return (
//     <div className="w-full p-6">
//       <div className="flex gap-6">
//         <div className="flex flex-col gap-2 w-20">
//           {product.images?.slice(0, 4).map((image, index) => (
//             <div
//               key={index}
//               className={`w-16 h-16 border rounded overflow-hidden cursor-pointer ${
//                 selectedImage === image
//                   ? "border-blue-500 border-2"
//                   : "border-gray-300"
//               }`}
//               onClick={() => setSelectedImage(image)}
//             >
//               <Image
//                 src={image}
//                 alt={`${product.title} ${index + 1}`}
//                 width={64}
//                 height={64}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ))}
//         </div>

//         <div className="flex-1 max-w-md">
//           <Image
//             src={selectedImage}
//             alt={product.title}
//             width={400}
//             height={400}
//             className="w-full h-96 object-contain rounded-lg border"
//           />
//         </div>

//         <div className="flex-1 space-y-4">
//           <Rating
//             rating={product.rating}
//             reviewCount={product.reviews?.length || 0}
//           />
//           <h1 className="text-3xl font-bold">{product.title}</h1>

//           <div className="flex items-center gap-4">
//             <div className="text-4xl font-bold">₹{product.price}</div>
//             {product.discountPercentage && (
//               <div className="text-sm text-gray-500">
//                 MRP ₹
//                 {(
//                   product.price /
//                   (1 - product.discountPercentage / 100)
//                 ).toFixed(0)}
//                 <span className="text-green-600 ml-2">
//                   <Badge variant="outline" className="ml-1">
//                     Save ₹
//                     {(
//                       product.price / (1 - product.discountPercentage / 100) -
//                       product.price
//                     ).toFixed(0)}
//                   </Badge>
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-3">
//             {product.tags?.map((tag, index) => (
//               <Badge key={index} variant="secondary" className="capitalize">
//                 {tag}
//               </Badge>
//             ))}
//           </div>

//           <p className="text-gray-600 text-sm leading-relaxed">
//             {product.description}
//           </p>

//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
//                 <span className="text-green-600 text-xs">✓</span>
//               </div>
//               <div>
//                 <div className="font-semibold">Brand: {product.brand}</div>
//                 <div className="text-sm text-gray-500">
//                   Stock: {product.stock} | Weight: {product.weight}g
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
//                 <span className="text-green-600 text-xs">✓</span>
//               </div>
//               <div>
//                 <div className="font-semibold">SKU: {product.sku}</div>
//                 <div className="text-sm text-gray-500">
//                   {product.warrantyInformation} | {product.shippingInformation}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="font-medium">
//             {product.availabilityStatus} | {product.returnPolicy}
//           </div>

//           <div className="flex gap-3">
//             <Button
//               onClick={handleAddToCart}
//               className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700"
//             >
//               Add to Cart
//             </Button>
//             <Button
//               variant="outline"
//               className="flex-1 border border-gray-900 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100"
//             >
//               Buy Now
//             </Button>
//           </div>
//         </div>
//       </div>
//       <ProductDetailsReviews reviews={product.reviews || []} />
//     </div>
//   );
// };

// export default ProductDetailsPage;