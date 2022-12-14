import {
  useContext,
  useMemo,
  useState,
  cloneElement,
  isValidElement,
  useLayoutEffect
} from 'react'
import FormContext from '../../context/formContext'
import Label from './label'
import Message from './message'
import { XFormItemProps } from '../../types'

const XFormItem = ({
  name,
  children,
  ui = {},
  defaultValue,
  required = false,
  rules = {},
  hidden = false,
  visible = true,
  trigger = 'onChange',
  isContainer = false, // 组件类型
}: // validateTrigger = "onChange",
XFormItemProps) => {
  const formInstance = useContext<any>(FormContext)
  const { registerValidateFields, dispatch, unRegisterValidate } = formInstance
  const [fieldVisible, setFieldVisible] = useState(visible)

  const [, forceUpdate] = useState({})

  const onStoreChange = useMemo(() => {
    const onStoreChange = {
      changeValue({ visible, ...rest }) {
        forceUpdate({})
        setFieldVisible(visible)
      }
    }
    return onStoreChange
  }, [formInstance])

  // 注册 formItem name 保存其状态
  useLayoutEffect(() => {
    name &&
      registerValidateFields(name, onStoreChange, {
        ...rules,
        required,
        hidden,
        visible,
        defaultValue,
        isContainer,
        label: ui?.label
      })
    return () => {
      name && unRegisterValidate(name)
    }
  }, [onStoreChange])

  // label 上额外的操作配置 比如 switch 触发事件时将此 key: values 值放入到组件value中
  const handleLabelSwitchChange = (val: boolean | unknown) => {
    dispatch({ type: 'setFieldsLabelOperateValue' }, name, { isOpen: val })
  }

  // 使表单控件 变成 可控的
  const getControlled = (child: any) => {
    const mergeChildrenProps = { ...child.props }
    if (!name) return mergeChildrenProps

    // 更改表单的值
    const handleChange = (val: any) => {
      dispatch({ type: 'setFieldValue' }, name, val)
    }

    mergeChildrenProps[trigger] = handleChange

    // 验证表单的值
    // if (required || rules) {
    //   mergeChildrenProps[validateTrigger] = (e: any) => {
    //     if (validateTrigger === trigger) {
    //       handleChange(e)
    //     }
    //     // 触发表单验证
    //     dispatch({ type: "validateFieldValue" }, name)
    //   }
    // }

    // 获取value
    mergeChildrenProps.value = dispatch({ type: 'getFieldValue' }, name) || ''
    // console.log(mergeChildrenProps.value, name)
    return mergeChildrenProps
  }

  const renderChildren = () => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        ...getControlled(children),
      } as any)
    }
    return cloneElement(children)
  }

  if (!fieldVisible) {
    return null
  }

  return (
    <Label ui={ui} required={required} operationVal={true} onChange={handleLabelSwitchChange}>
      {renderChildren()}
      {!isContainer && <Message name={name} {...dispatch({ type: 'getFieldModel' }, name)} />}
    </Label>
  )
}

export default XFormItem
