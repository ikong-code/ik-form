// 容器描边

import XColor from '../XColor'
import XNumberInput from '../../AtomComponents/XNumberInput'
import './index.less'
const XLineStyle = ({ value, onChange }) => {
  const handleChange = (val, type) => {
    const newValue = {
      ...value,
      [type]: val
    }
    onChange(newValue)
  }

  return (
    <div className="border-stroke">
      <div className="stroke-item">
        <XColor
          value={value?.color || '#000000'}
          onChange={(val: string) => handleChange(val, 'color')}
        />
        <span>颜色</span>
      </div>
      <div className="stroke-item">
        <XNumberInput
          value={value?.thickness || 1}
          min={1}
          max={100}
          onChange={(val: string) => handleChange(val, 'thickness')}
        />
        <span>粗细</span>
      </div>
    </div>
  )
}

export default XLineStyle
