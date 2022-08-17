type labelAlign = 'top' | 'left' | 'right'

/**
 * label 组件名label
 * labelWidth 组件名宽度
 * height 组件高度
 * labelAlign 组件高度
 */

export interface LabelUIProps {
  label?: string | React.ReactNode
  labelWidth?: number
  height?: number
  labelAlign?: labelAlign
  tooltip?: string | { title: React.ReactNode | any; icon?: React.ReactElement }
  openSwitch?: boolean
  extra?: React.ReactElement
  checkedChildren?: string
  unCheckedChildren?: string
}

export interface ElementTabs {
  label: string
  value: string
  schema?: any
  xlinkargs?: any
  initialValues?: any
}

export interface LabelProps {
  children: React.ReactNode
  operationVal: boolean | any
  required?: boolean
  ui: LabelUIProps
  onChange?: (val: boolean | unknown) => void
}

export interface XFormItemProps {
  name: string
  children: React.ReactElement
  defaultValue: any
  ui: LabelUIProps
  isContainer?: boolean // 容器 true | 表单组件 false
  required?: boolean
  rules?: any
  visible?: boolean // 只是隐藏样式
  hidden?: boolean // 完全隐藏 表单提交时也无此字段
  trigger?: string
  validateTrigger?: string
}

export interface SelectOptions {
  label: string | React.ReactNode
  value: string | number | boolean
}
