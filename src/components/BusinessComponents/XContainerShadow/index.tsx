// 容器阴影组件
import Space from '../../AtomComponents/Space'
import XColor from '../XColor'
import XNumberInput from '../../AtomComponents/XNumberInput'
import './index.less'

const XBorderStroke = ({ value, onChange }) => {
  const handleChange = (val, type) => {
    const newValue = {
      ...value,
      [type]: val
    }
    onChange(newValue)
  }

  return (
    <Space>
      <div className="shadow-item">
        <XColor
          value={value?.color || '#000000'}
          onChange={(val: string) => handleChange(val, 'color')}
        />
        <span>颜色</span>
      </div>
      <div className="shadow-item">
        <XNumberInput
          value={value?.x || 1}
          max={100}
          onChange={(val: string) => handleChange(val, 'x')}
        />
        <span>X</span>
      </div>
      <div className="shadow-item">
        <XNumberInput
          value={value?.y || 1}
          max={100}
          onChange={(val: string) => handleChange(val, 'y')}
        />
        <span>Y</span>
      </div>
      <div className="shadow-item">
        <XNumberInput
          value={value?.blur || 1}
          max={100}
          onChange={(val: string) => handleChange(val, 'blur')}
        />
        <span>模糊</span>
      </div>
      <div className="shadow-item">
        <XNumberInput
          value={value?.extend || 1}
          max={100}
          onChange={(val: string) => handleChange(val, 'extend')}
        />
        <span>扩展</span>
      </div>
    </Space>
  )
}

export default XBorderStroke
