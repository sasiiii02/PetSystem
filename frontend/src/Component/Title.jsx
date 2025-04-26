import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">{text1}</span>
      <span className="text-2xl font-bold text-blue-600">{text2}</span>
    </div>
  )
}

export default Title
