import XUploadImg from '../../AtomComponents/XUploadImg'
import { Select } from 'antd'
import Space from '../../AtomComponents/Space'
const { Option } = Select

const ImageSizeOptions = ['140%', '120%', '100%', '80%', '60%']

const XImageSizeStyle = ({ value, onChange }) => {
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
        <XUploadImg value={value?.iconUrl} onChange={val => handleChange(val, 'iconUrl')} />
        <span style={{ display: 'inline-block' }}></span>
      </div>
      <div className="stroke-item">
        {/*// todo fix type*/}
        {/*// @ts-ignore*/}
        <Select value={value?.size || '100%'} onChange={val => handleChange(val, 'size')}>
          {ImageSizeOptions.map(i => (
            // todo fix type
            // @ts-ignore
            <Option key={i || 'normal'} value={i}>
              {i}
            </Option>
          ))}
        </Select>
        <span>大小</span>
      </div>
    </Space>
  )
}

export default XImageSizeStyle
