import React from 'react'

export const EmptyState = ({iconNode, icon, text, subtext, node, color, height, width}) => {
  return (
    <div className='w-full flex items-center justify-center m-auto flex-col space-y-2 h-full'>
      {
        iconNode ?
        iconNode : null 
      }
      { icon ? 
        <img
            className={`${height, width} `}
            src={icon}
            style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            objectFit: "cover",
            backgroundColor: "transparent"
            }}
            onError={(e) => {
            e.target.onerror = null;
            e.target.src = '';
            }}
            alt="profile"
        /> : null
      }
      <p className={`${color ? color : "text-tblack-100"} text-center text-base font-extrabold`}>{text}</p>
      <span className={`${color ? color : "text-tgray-150"} w-2/3 text-xs text-center font-normal`}>{subtext}</span>
      {!!node && node}
    </div>
  )
}