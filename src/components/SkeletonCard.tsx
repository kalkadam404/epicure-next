interface SkeletonCardProps {
  variant?: 'restaurant' | 'dish' | 'offer';
  count?: number;
}

export function SkeletonCard({ variant = 'restaurant', count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            
            {variant === 'restaurant' && (
              <>
                {/* Rating & cuisine */}
                <div className="flex gap-4 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </>
            )}
            
            {variant === 'dish' && (
              <>
                {/* Price */}
                <div className="h-6 bg-gray-200 rounded w-24 mt-4" />
              </>
            )}
            
            {variant === 'offer' && (
              <>
                {/* Price row */}
                <div className="flex gap-4 mt-4">
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
                {/* Badge */}
                <div className="h-8 bg-gray-200 rounded w-32 mt-2" />
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
