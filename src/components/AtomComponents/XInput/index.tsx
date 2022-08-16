import { Input } from 'antd'

const XInput = (props: any) => {
  const { onChange } = props
  return <Input className="form-input p-4" {...props} onChange={e => onChange(e.target.value)} />
}
export default XInput
