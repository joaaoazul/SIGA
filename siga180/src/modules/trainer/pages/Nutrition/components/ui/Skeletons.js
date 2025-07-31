// src/modules/trainer/pages/Nutrition/components/ui/Skeletons.js
import React from 'react';

// Base Skeleton component with shimmer animation
const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

// Skeleton for Plan Cards
export const PlanCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="text-center">
            <Skeleton className="h-4 w-16 mx-auto mb-1" />
            <Skeleton className="h-6 w-12 mx-auto" />
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Athlete Cards
export const AthleteCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Skeleton className="h-12 w-12 rounded-full mr-3" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-full rounded" />
        <Skeleton className="h-9 w-full rounded" />
      </div>
    </div>
  );
};

// Skeleton for Meal Timeline
export const MealTimelineSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-8 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton for Stats Cards
export const StatsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <Skeleton className="h-8 w-8 mx-auto mb-2 rounded" />
      <Skeleton className="h-8 w-16 mx-auto mb-1" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-gray-200">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full mr-4" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-28 mb-1" />
        <Skeleton className="h-3 w-20" />
      </td>
      <td className="px-6 py-4 text-center">
        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
      </td>
      <td className="px-6 py-4 text-center">
        <Skeleton className="h-4 w-20 mx-auto" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
};

export default Skeleton;