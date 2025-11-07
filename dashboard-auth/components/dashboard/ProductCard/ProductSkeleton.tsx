import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProductSkeleton = () => {
  return (
    <Card className="max-w-sm animate-pulse">
      <CardHeader>
        <div className="h-48 bg-gray-300 rounded-t-lg" />
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="h-8 bg-gray-300 rounded w-16" />
          <div className="h-6 bg-gray-300 rounded w-20" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-12" />
          <div className="h-4 bg-gray-300 rounded w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSkeleton;
