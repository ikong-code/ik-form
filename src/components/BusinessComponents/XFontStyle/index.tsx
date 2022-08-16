// 文字样式
import Space from '../../AtomComponents/Space'
import { Select } from 'antd'
import XColor from '../XColor'
import XNumberInput from '../../AtomComponents/XNumberInput'
import './index.less'

const { Option } = Select

const fontWeightOptions = [
  { label: '变细', value: 'lighter' },
  { label: '正常', value: 'normal' },
  { label: '加粗', value: 'bolder' }
]
const XFontStyle = ({ value, onChange }) => {
  const handleChange = (val, type) => {
    const newValue = {
      ...value,
      [type]: val
    }
    onChange(newValue)
  }

  return (
    <Space>
      <div className="stroke-item">
        <XNumberInput
          value={value?.fontSize || 18}
          min={1}
          max={100}
          onChange={(val: string) => handleChange(val, 'fontSize')}
        />
        <span>字号</span>
      </div>
      <div className="stroke-item">
        <Select value={value?.fontWeight} onChange={val => handleChange(val, 'fontWeight')}>
          {fontWeightOptions.map(i => (
            // todo fix type
            // @ts-ignore
            <Option key={i.value || 'normal'} value={i.value}>
              {i.label}
            </Option>
          ))}
        </Select>
        <span>样式</span>
      </div>
      <div className="stroke-item">
        <XColor
          value={value?.color || '#262A30'}
          onChange={(val: string) => handleChange(val, 'color')}
        />
        <span>颜色</span>
      </div>
    </Space>
  )
}

export default XFontStyle
