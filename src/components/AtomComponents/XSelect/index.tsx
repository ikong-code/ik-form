import { Select } from 'antd'

const Option = Select.Option

interface OptionsPorps {
  children: React.ReactNode

  /** Save for customize data */
  [prop: string]: any
}

function XSelect({ children, ...props }: any) {
  const { value, options = [], placeholder = '', ...rest } = props
  return (
    <Select
      {...rest}
      value={value}
      placeholder={placeholder}
      style={{ width: '100%', textAlign: 'left' }}
    >
      {options.map((o: OptionsPorps) => {
        return (
          // todo fix type
          // @ts-ignore
          <Option key={o.value} label={o.label} value={o.value}>
            {o.label}
          </Option>
        )
      })}
      {children}
    </Select>
  )
}

/* 绑定静态属性   */

export default XSelect
