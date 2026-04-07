const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export const SkeletonStatCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <Pulse className="w-12 h-12 rounded-xl mb-4" />
    <Pulse className="h-8 w-16 mb-2" />
    <Pulse className="h-4 w-24" />
  </div>
);

export const SkeletonServiceCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
    <div className="flex justify-between">
      <Pulse className="h-5 w-20 rounded-full" />
      <Pulse className="h-5 w-12" />
    </div>
    <Pulse className="h-5 w-3/4" />
    <Pulse className="h-4 w-full" />
    <Pulse className="h-4 w-2/3" />
    <Pulse className="h-9 w-full rounded-xl mt-1" />
  </div>
);

export const SkeletonTableRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-50">
    <Pulse className="w-9 h-9 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <Pulse className="h-4 w-32" />
      <Pulse className="h-3 w-48" />
    </div>
    <Pulse className="h-6 w-16 rounded-full" />
    <Pulse className="h-8 w-20 rounded-lg" />
  </div>
);

export default Pulse;
