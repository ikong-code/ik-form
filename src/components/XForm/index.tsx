import React, { useState, useEffect } from 'react'
import FormContext from '../../context/formContext'
import EventBus from '../../utils/eventBus'
import AllFormFields from '../registerFormFields'
import { XFormItem } from '../index'
import './index.less'

const Form = (
  { form, onFinish, onFinishFailed, children }: any
) => {

  const { schema, customRegisterComps = {}, onResponsive } = form
  const { setCallback, responsiveFieldValue, dispatch } = form

  const [allRegisterComps] = useState(Object.assign(AllFormFields, customRegisterComps))

  /** 初始化时 递归遍历获取动态配置field 的 defaultValue */
  // const getInitValues = (schema: []) => {
  //   const initValues: { [key: string]: any } = {}
  //   const ergodic = (schema: []) => {
  //     schema.forEach((i: any) => {
  //       if (i.defaultValue) {
  //         // 内置规则，如果开启了label 的switch配置项，组件的数据结构要改为如下结果
  //         if (i?.ui?.openSwitch) {
  //           initValues[i.key] = { isOpen: false, value: i.defaultValue }
  //         } else {
  //           initValues[i.key] = i.defaultValue
  //         }
  //       }
  //       if (i.children && i.children.length) {
  //         ergodic(i.children)
  //       }
  //     })
  //   }
  //   ergodic(schema)
  //   return initValues
  // }

  // 创建 form 状态管理实例
  // 将json里配置的defaultValue 与 传进来的 initialValue 合并


  // 向 form 注册回调函数
  setCallback({
    onFinish,
    onFinishFailed
  })

  useEffect(() => {
    // 等组件全部注册完之后 初始化执行联动逻辑
    setTimeout(() => {
      dispatch({ type: 'initEffect' })
    }, 1)
  }, [form])

  useEffect(() => {
    onResponsive &&
      EventBus.addListener('responsiveField', values => {
        // 因为 eventbus 无法区分 多个 form 实例，获取当前的 model，判断是否存在 field key
        const model = dispatch({ type: 'getFormModel' })
        Object.keys(values).forEach(i => {
          model.hasOwnProperty(i) && onResponsive(values)
        })
      })
  }, [])

  // 递归渲染组件 所有组件渲染逻辑在此处处理
  const renderTransformSchema = (schema = []) => {
    return schema.map(i => {
      const {
        key,
        type,
        ui = {},
        required = false,
        defaultValue,
        children,
        label,
        hidden = false,
        props = {}
      } = i

      const Component = allRegisterComps[type]

      if (!Component) {
        return null
      }

      if (type === 'container') {
        return (
          <XFormItem key={key} {...i} isContainer={true} name={key}>
            <Component key={key} label={label}>
              {renderTransformSchema(children)}
            </Component>
          </XFormItem>
        )
      }
      return (
        <XFormItem key={key} {...i} name={key}>
          <Component defaultValue={defaultValue} {...props} />
        </XFormItem>
      )
    })
  }

  // Form能够被ref标记，并操作实例
  const RenderChildren = (
    <FormContext.Provider value={form}>
      {renderTransformSchema(schema)}
      {children}
    </FormContext.Provider>
  )

  return (
    <form
      className="xform"
      onReset={e => {
        e.preventDefault()
        e.stopPropagation()
        form.resetFields()
      }}
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.submit()
      }}
    >
      {RenderChildren}
    </form>
  )
}

export default Form
