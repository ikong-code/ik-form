import { unstable_batchedUpdates } from 'react-dom'
import EventBus from './eventBus'
/* 对外接口  */
export const formInstanceApi = [
  'setCallback',
  'dispatch',
  'registerValidateFields',
  // 'isRegisterField',
  'resetFields', // 重置字段
  'setFields',
  'setFieldsValue',
  'setFieldsLabelOperateValue',
  'getFieldsValue',
  'getFieldValue',
  'validateFields',
  'responsiveFieldValue', // 响应式返回数据(单个组件数据)
  'submit',
  'unRegisterValidate',
  'initEffect',
  'setFieldVisible',
  'getFieldState',
  'getFormModel'
]

export const isReg = value => value instanceof RegExp

/**
 *
 */
export class FormStore {
  constructor(forceUpdate, defaultFormValue = {}, xlinkages) {
    this.FormUpdate = forceUpdate // form 的更新函数
    this.model = {} // 表单状态
    this.control = {} // 控制每个FormItem
    this.isSchedule = false
    this.callback = {} // 存放监听函数
    this.penddingValidateQueue = [] // 批量更新队列
    this.defaultFormValue = defaultFormValue // 表单初始化的值
    this.xlinkagesRelate = new Map() // 维护 xlinkages 关系 type = watch
    this.xlinkagesVisible = new Map() //  维护 xlinkages 关系 Map数据结构 type = visible
    this.initXlinkages(xlinkages)
  }

  // 初始化处理联动关系
  initXlinkages(xlinkages = []) {
    xlinkages.forEach(x => {
      // 组件值变动 控制其他组件是否显隐
      if (x.type === 'target:visible') {
        const sourceFieldName = x.source
        x.rules.forEach(rule => {
          const { target, condition } = rule
          const targetList = target.split(',')
          targetList.forEach(t => {
            const targetFieldName = t?.trim()
            if (!this.xlinkagesVisible.has(sourceFieldName)) {
              this.xlinkagesVisible.set(sourceFieldName, [{ field: targetFieldName, condition }])
            } else {
              const keyValue = this.xlinkagesVisible.get(sourceFieldName)
              this.xlinkagesVisible.set(sourceFieldName, [
                ...keyValue,
                { field: targetFieldName, condition }
              ])
            }
          })
        })
      }
      // 组件自身 监控 target值的变化
      if (x.type === 'self:watch') {
        const sourceFieldName = x.source
        const targetFieldNameList = x.target.split(',')
        targetFieldNameList.forEach(t => {
          const targetFieldName = t?.trim()
          if (!this.xlinkagesRelate.has(targetFieldName)) {
            this.xlinkagesRelate.set(targetFieldName, [
              { field: sourceFieldName, condition: x.condition }
            ])
          } else {
            const keyValue = this.xlinkagesRelate.get(targetFieldName)
            this.xlinkagesRelate.set(targetFieldName, [
              ...keyValue,
              { field: sourceFieldName, condition: x.condition }
            ])
          }
        })
      }
    })
  }

  // 提供操作form的方法
  getForm() {
    return formInstanceApi.reduce((map, item) => {
      map[item] = this[item].bind(this)
      return map
    }, {})
  }

  getFormModel() {
    return this.model
  }

  // 创建一个验证模块
  createValidate(name, validate) {
    const { value, rule, required, message, visible, hidden, xLinkages, isContainer, ...rest } =
      validate
    return {
      value,
      rule: rule || (() => true),
      required: required || false,
      message: message || '',
      status: 'pending',
      visible,
      hidden,
      xLinkages,
      isContainer,
      ...rest
    }
  }

  // 处理回调函数
  setCallback(callback) {
    if (callback) this.callback = callback
  }

  // 所有组件注册完之后 初始化执行一次
  initEffect() {
    for (let item in this.model) {
      this.setFieldsValue(item, this.model[item]?.value)
    }
  }

  // 触发事件
  dispatch(action, ...arg) {
    if (!action && typeof action !== 'object') return null
    const { type } = action
    if (~formInstanceApi.indexOf(type)) {
      return this[type](...arg)
    } else if (typeof this[type] === 'function') {
      return this[type](...arg)
    }
  }

  // 判断是否当前字段是否有注册过
  // isRegisterField(name) {
  //   return !!this.model[name]
  // }
  // 注册表单单元项
  registerValidateFields(name, control, model) {
    // 内置规则 defaultValue类型为 { isOpen: false, value: any } 时要进行数据格式转换
    if (this.defaultFormValue[name]) {
      const value = this.defaultFormValue[name]
      if (typeof value === 'object' && value?.hasOwnProperty('isOpen')) {
        model.value = value?.value
        model.isOpen = value?.isOpen
      } else {
        model.value = value
      }
    } else {
      this.defaultFormValue[name] = model.defaultValue
      model.value = model.defaultValue
    }
    // 注册时传进来的 defaultValue 不包含 isOpen 特定的数据格式， 直接负值
    const validate = this.createValidate(name, model)
    this.model[name] = validate
    this.control[name] = control
  }

  // 卸载表单单元项
  unRegisterValidate(name) {
    delete this.model[name]
    delete this.control[name]
  }

  // 通知 FormItem 更新
  // isChangeResponsiveField 默认开启响应式更新，submit 时关闭
  notifyChange(name, isChangeResponsiveField = true) {
    const controller = this.control[name]
    if (controller) controller?.changeValue()
    isChangeResponsiveField && this.responsiveFieldValue(name)
  }

  // 响应式返回数据
  responsiveFieldValue(name) {
    // 容器组件或隐藏的field 不进行此操作
    if (this.model[name] && (this.model[name].isContainer || !this.model[name].visible)) return null
    let value = null
    if (this.model[name].hasOwnProperty('isOpen')) {
      value = {
        isOpen: this.model[name].isOpen,
        value: this.model[name].value
      }
    } else {
      value = this.model[name].value
    }
    EventBus.emit('responsiveField', {
      [name]: value
    })
  }

  // 重置表单
  resetFields() {
    Object.keys(this.model).forEach(modelName => {
      if (!this.model[modelName].isContainer) {
        this.setValueClearStatus(this.model[modelName], modelName, null)
        console.log()
        formData[modelName] = this.model[modelName].value
      }
    })
  }

  // 设置一组字段状态
  setFields(object) {
    if (typeof object !== 'object') return
    Object.keys(object).forEach(modelName => {
      this.setFieldsValue(modelName, object[modelName].value)
    })
  }

  // 设置字段显隐
  setFieldVisible(name, visible) {
    this.model[name].visible = visible
  }
  getFieldState(name) {
    if (!this.model[name]) return null
    return this.model[name]
  }

  /* 复制并清空状态 */
  setValueClearStatus(model, name, value) {
    model.value = value
    model.status = 'pendding'
    this.notifyChange(name)
  }

  // label 上的操作更改时 赋值
  setFieldsLabelOperateValue(name, value) {
    if (!this.model[name]) return
    this.model[name] = { ...this.model[name], ...{ value } }
  }

  setFieldsValue(name, modelValue) {
    const model = this.model[name]
    if (!model) return false
    this.setValueClearStatus(model, name, modelValue)
    // if (typeof modelValue === "object") {
    //   const { message, rule, value } = modelValue
    //   console.log(modelValue, 'modelValue')
    //   if (message) model.message = message
    //   if (rule) model.rule = rule
    //   if (value) model.value = value
    //   model.status = "pending"
    //   this.validateFieldValue(name, true)
    // } else {
    // this.setValueClearStatus(model, name, modelValue)
    // }
    // 检验是否有联动关系
    for (let item of this.xlinkagesRelate) {
      const [fieldName, relates] = item
      if (name === fieldName) {
        relates.forEach(r => {
          const { field, condition } = r
          EventBus.emit('xlinkageswatch', {
            sourceField: field,
            targetField: name,
            condition,
            value: modelValue
          })
        })
      }
    }
    for (let item of this.xlinkagesVisible) {
      const [fieldName, relates] = item
      if (name === fieldName) {
        relates.forEach(r => {
          const { field, condition } = r
          EventBus.emit('xlinkagesSelfVisible', {
            sourceField: field,
            targetField: name,
            condition,
            value: modelValue
          })
        })
      }
    }
  }

  // 获取表单数据层的值
  getFieldsValue() {
    const formData = {}
    Object.keys(this.model).forEach(modelName => {
      // 不提交 容器的值
      // TODO 对visible / hidden 为 false 的值也不提交 后面增加逻辑
      if (!this.model[modelName].isContainer || !this.model[modelName].visible) {
        formData[modelName] = this.model[modelName].value
      }
    })
    return formData
  }

  // 获取表单模型
  getFieldModel(name) {
    const model = this.model[name]
    return model ? model : {}
  }

  // 获取对应字段名的值
  getFieldValue(name) {
    const model = this.model[name]
    // 没有注册但有默认值
    if (!model && this.defaultFormValue[name]) {
      return this.defaultFormValue[name]
    }
    return model ? model.value : null
  }

  /* 单一表单单元项验证 */
  validateFieldValue(name, forceUpdate = false, isChangeResponsiveField) {
    const model = this.model[name]
    /* 记录上次状态 */
    const lastStatus = model.status
    if (!model) return null
    const { required, rule, value } = model
    let status = 'resolve'
    if (required && !value) {
      status = 'reject'
    } else if (isReg(rule)) {
      /* 正则校验规则 */
      status = rule.test(value) ? 'resolve' : 'reject'
    } else if (typeof rule === 'function') {
      /* 自定义校验规则 */
      status = rule(value) ? 'resolve' : 'reject'
    }
    model.status = status
    if (lastStatus !== status || forceUpdate) {
      const notify = this.notifyChange.bind(this, name, isChangeResponsiveField)
      this.penddingValidateQueue.push(notify)
    }
    this.scheduleValidate()
    return status
  }
  /* 批量调度验证更新任务 */
  scheduleValidate() {
    if (this.isSchedule) return
    this.isSchedule = true
    Promise.resolve().then(() => {
      /* 批量更新验证任务 */
      unstable_batchedUpdates(() => {
        do {
          let notify = this.penddingValidateQueue.shift()
          notify && notify() /* 触发更新 */
        } while (this.penddingValidateQueue.length > 0)
        this.isSchedule = false
      })
    })
  }
  /* 表单整体验证 */
  validateFields(callback) {
    let status = true
    Object.keys(this.model).forEach(modelName => {
      // 不对容器做校验
      if (!this.model[modelName]?.isContainer || this.model[modelName]?.visible) {
        const modelStates = this.validateFieldValue(modelName, true, false)
        if (modelStates === 'reject') status = false
      }
    })
    callback(status)
  }
  /* 提交表单 */
  submit(cb) {
    // 对表单进行校验
    this.validateFields(res => {
      const { onFinish, onFinishFailed } = this.callback
      if (typeof cb !== 'function') throw new Error('提交参数必须是一个函数')
      if (!res) {
        onFinishFailed && typeof onFinishFailed === 'function' && onFinishFailed() /* 验证失败 */
        cb({ success: false, msg: '校验失败', data: null })
      } else {
        const formData = this.getFieldsValue()
        onFinish && typeof onFinish === 'function' && onFinish(formData) /* 验证成功 */
        cb({ success: true, msg: '校验成功', data: formData })
      }
    }, false)
  }
}
