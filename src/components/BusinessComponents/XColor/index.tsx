import { Popover } from 'antd'
import ColorPicker from '../../AtomComponents/ColorPicker'
import './index.less'

const XColor = (props: any) => {
  const { defaultValue, value, onChange } = props
  return (
    <Popover
      trigger="click"
      content={
        <ColorPicker
          defaultValue={defaultValue}
          value={value}
          onChange={(val: string) => onChange(val)}
        />
      }
    >
      <div className="color-select">
        {value || defaultValue}
        <span className="color-block" style={{ backgroundColor: value || defaultValue }} />
      </div>
    </Popover>
  )
}

export default XColor
