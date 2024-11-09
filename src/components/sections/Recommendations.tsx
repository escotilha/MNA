import React from 'react';
import { ArrowRight } from 'lucide-react';

export function Recommendations() {
  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Consider accelerating the acquisition schedule if operational synergies exceed expectations</p>
      </div>
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Implement working capital optimization strategies to improve cash conversion rate</p>
      </div>
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Explore opportunities for debt refinancing if market conditions improve</p>
      </div>
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Develop detailed integration plan focusing on key value drivers</p>
      </div>
    </div>
  );
}