import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailsSkeleton = () => (
  <div className="w-full p-6">
    <div className="flex gap-6">
      <div className="flex flex-col gap-2 w-20">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-16 h-16 rounded" />
        ))}
      </div>
      
      <div className="flex-1 max-w-md">
        <Skeleton className="w-full h-96 rounded-lg" />
      </div>
      
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailsSkeleton;