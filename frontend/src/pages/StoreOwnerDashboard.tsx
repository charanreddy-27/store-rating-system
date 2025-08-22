import React, { useState, useEffect } from 'react';
import { dashboardService, type StoreOwnerDashboard as StoreOwnerDashboardType } from '../services/dashboardService';

const StoreOwnerDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<StoreOwnerDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getStoreOwnerDashboard();
        setDashboard(data);
      } catch (error: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
      
      {/* Store Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{dashboard?.store.name}</h3>
            <p className="text-gray-600">{dashboard?.store.address}</p>
            <p className="text-gray-600">{dashboard?.store.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Average Rating:</span>
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(dashboard?.averageRating || 0))}
                <span className="text-lg font-semibold text-gray-900">
                  {dashboard?.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>
            <p className="text-gray-600">
              Total Ratings: <span className="font-semibold">{dashboard?.totalRatings || 0}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Ratings</h2>
        {dashboard?.ratings && dashboard.ratings.length > 0 ? (
          <div className="space-y-4">
            {dashboard.ratings.map((rating: any) => (
              <div key={rating.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{rating.user.name}</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700 text-sm">{rating.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No ratings yet</p>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dashboard?.ratings.filter((r: any) => r.rating === star).length || 0;
              const percentage = dashboard?.totalRatings ? (count / dashboard.totalRatings * 100) : 0;
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Last rating: {dashboard?.ratings[0] ? 
                new Date(dashboard.ratings[0].createdAt).toLocaleDateString() : 
                'No ratings yet'
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total customers: {dashboard?.ratings.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
          <div className="mt-4">
            <div className="text-2xl font-bold text-green-600">
              {dashboard?.averageRating ? (dashboard.averageRating >= 4 ? 'Excellent' : 
                dashboard.averageRating >= 3 ? 'Good' : 
                dashboard.averageRating >= 2 ? 'Fair' : 'Needs Improvement') : 'No Data'}
            </div>
            <p className="text-sm text-gray-600">Overall Performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
