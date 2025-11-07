import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/dashboard/${product.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer max-w-sm">
        <CardHeader>
          <div className="h-48">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={400}
              height={192}
              className="w-full h-full object-contain rounded-t-lg"
            />
          </div>
          <CardTitle className="text-lg">{product.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">${product.price}</span>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Stock: {product.stock}</span>
            <span>Rating: {product.rating}/5</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
