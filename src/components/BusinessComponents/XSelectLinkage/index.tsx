import { useState } from 'react'
import { Select } from 'antd'
import Space from '../../AtomComponents/Space'

const { Option } = Select
const operateList = [{ label: '系统功能', value: 'system' }]
const classify = {
  system: [{ label: '审批', value: 'shenpi' }]
}

const jumpType = [
  { label: '内跳', value: 1 },
  { label: '外跳', value: 2 }
]

const XSelectLinkage = ({ value, onChange }) => {
  const [linkageValue, setLinkageValue] = useState(value)

  const handleChange = (val, type) => {
    const newValue = {
      ...linkageValue,
      [type]: val
    }
    if (type === 'operate') {
      newValue.classify = classify[val][0].value
    }
    setLinkageValue(newValue)
    onChange(Object.keys(newValue).length === 3 ? newValue : null)
  }

  return (
    <Space>
      <Select
        value={value?.operate}
        style={{ width: 108 }}
        onChange={val => handleChange(val, 'operate')}
      >
        {operateList.map(i => (
          <Option key={i.value} value={i.value}>
            {i.label}
          </Option>
        ))}
      </Select>
      <Select
        value={value?.classify || ''}
        style={{ width: 216 }}
        onChange={(val: any): void => handleChange(val, 'classify')}
      >
        {classify[value?.operate || operateList?.[0]?.value].map(i => (
          <Option key={i.value} value={i.value}>
            {i.label}
          </Option>
        ))}
      </Select>
      <Select value={value?.jump} style={{ width: 92 }} onChange={val => handleChange(val, 'jump')}>
        {jumpType.map(i => (
          <Option key={i.value} value={i.value}>
            {i.label}
          </Option>
        ))}
      </Select>
    </Space>
  )
}

export default XSelectLinkage
