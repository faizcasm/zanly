import React from 'react';

const StatCard = ({ title, value, detail, color, Icon }) => (
  <div className="rounded-3xl shadow-xl shadow-teal-200/10 border border-gray-100 p-6 transition transform hover:-translate-y-1 hover:shadow-2xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {Icon && <Icon className={`w-8 h-8 ${color === 'teal' ? 'text-teal-600' : 'text-amber-500'}`} />}
    </div>
    <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
    <p className={`text-sm mt-1 ${
      detail.includes('+') ? 'text-green-600' :
      detail.includes('Goal') ? 'text-gray-500' :
      'text-blue-600'
    }`}>
      {detail}
    </p>
  </div>
);

export default StatCard;
