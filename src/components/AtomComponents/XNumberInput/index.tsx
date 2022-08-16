import { InputNumber } from 'antd'

const XNumberInput = ({ value, defaultValue, onChange, ...rest }: any) => {
  return (
    <InputNumber
      style={{ width: '100%' }}
      value={value || defaultValue}
      onChange={onChange}
      min={1}
      max={100000}
      {...rest}
    />
  )
}

export default XNumberInput
