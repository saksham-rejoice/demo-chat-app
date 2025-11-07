import React, { Fragment } from 'react'

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface ProductDetailsReviewsProps {
  reviews: Review[];
}

const ProductDetailsReviews = ({ reviews }: ProductDetailsReviewsProps) => {
  return (
    <Fragment>
          <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews?.map((review, index) => (
            <div key={index} className="border-b pb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                  {review.reviewerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.reviewerName}</span>
                    <div className="text-orange-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export default ProductDetailsReviews