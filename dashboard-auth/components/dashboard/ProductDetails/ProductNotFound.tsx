import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const ProductNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent   className="flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 text-center">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
  )
}

export default ProductNotFound