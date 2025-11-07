interface RatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
}

const Rating = ({ rating, reviewCount = 0, showCount = true }: RatingProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-yellow-400">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
      </div>
      <span className="font-semibold">{rating}</span>
      {showCount && (
        <span className="text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
};

export { Rating };