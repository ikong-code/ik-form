import React from 'react'
import './index.less'

export default function Space({ children }) {
  return (
    <div className="xspace">
      {children.map(x => (
        <div key={x} className="xspace__item">{x}</div>
      ))}
    </div>
  )
}
