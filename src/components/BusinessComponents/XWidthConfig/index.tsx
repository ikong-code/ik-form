import { useState } from 'react'
import XNumberInput from '../../AtomComponents/XNumberInput'
import XSelect from '../../AtomComponents/XSelect'
const XWidthConfig = (props: any) => {
  const { value = 1920, xlinkageswatch = {}, onChange, options = [], ...rest } = props

  const isPercent = typeof value === 'string'

  // percent / number 百分比 或 数值类型
  const [type, setType] = useState(isPercent ? 'percent' : 'number')
  const handleIptChange = val => {
    if (type === 'percent') {
      onChange(val + '%')
    } else {
      onChange(val)
    }
  }

  const handleSelectChange = type => {
    setType(type)
    onChange(type === 'percent' ? '100%' : 1920)
  }
  if (xlinkageswatch?.targetValue) {
    return (
      <div>
        <XSelect {...rest} options={options} onChange={handleSelectChange} value={type} />
        {type === 'percent' ? (
          <XNumberInput
            value={typeof value === 'string' ? +value.replace('%', '') : value}
            min={1}
            max={100}
            onChange={handleIptChange}
            {...rest}
            style={{ width: '100%', marginTop: 8 }}
            addonAfter="%"
          />
        ) : (
          <XNumberInput
            value={value}
            min={1}
            max={10000}
            onChange={handleIptChange}
            {...rest}
            style={{ width: '100%', marginTop: 8 }}
            addonAfter="px"
          />
        )}
      </div>
    )
  }
  return (
    <XNumberInput
      min={1}
      max={10000}
      {...rest}
      onChange={handleIptChange}
      value={typeof value === 'string' ? +value.replace('%', '') : value}
      style={{ width: '100%', marginTop: 8 }}
      addonAfter="px"
    />
  )
}

export default XWidthConfig
