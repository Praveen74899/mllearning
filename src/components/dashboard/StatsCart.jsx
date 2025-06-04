import React from 'react'

const StatsCart = ({title,value,icon,linkTo,iconBgColor,iconColor}) => {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-xl p-2 shadow shadow-purple-500">
         <div className={`p-3 rounded-full mr-4 ${iconBgColor} ${iconColor}`}>
            {icon}
         </div>
 
         <div >
            <p>{title}</p>
            <h1>{value}</h1>
         </div>

    </div>
  )
}

export default StatsCart