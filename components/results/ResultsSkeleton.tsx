import { Skeleton } from '../shared/Skeleton';

export default function ResultsSkeleton() {
    return (
        <div className="max-w-6xl mx-auto pt-24 pb-16 px-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Score + Breakdown Skeleton */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-64 rounded-xl lg:col-span-2" />
            </div>

            {/* Keywords Skeleton */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>

            {/* Skills + Formatting Skeleton */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>

            {/* Suggestions Skeleton */}
            <Skeleton className="h-40 rounded-xl" />
        </div>
    );
}
