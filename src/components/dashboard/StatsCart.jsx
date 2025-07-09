import React from 'react';

const StatsCart = ({ title, value, icon, iconBgColor, iconColor, linkTo }) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
      <div className={`p-3 rounded-full ${iconBgColor} ${iconColor} text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h1 className="text-xl font-bold text-gray-800">{value}</h1>
      </div>
    </div>
  );
};


export default StatsCart;
