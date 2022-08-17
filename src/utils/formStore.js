import { unstable_batchedUpdates } from 'react-dom'
import EventBus from './eventBus'
/* 对外接口  */
export const formInstanceApi = [
  'setCallback',
  'dispatch',
  'registerValidateFields', // 注册表单字段
  'resetFields', // 重置字段
  'setFields', // 设置一组数据
  'setFieldValue', // 设置单个数据
  'setFieldsLabelOperateValue', // label 上的操作更改时 触发的事件
  'getFieldState', // 获取单个字段属性值
  'setFieldState', // 设置单个字段属性值
  'getFormValue', // 提交时获取表单数据
  'getFieldValue', // 获取单个字段值
  'validateFields', // 执行表单全量校验
  'responsiveFieldValue', // 响应式返回数据(单个组件数据)
  'submit', // 提交
  'unRegisterValidate', // 注销字段
  'initEffect',
  // 'setFieldVisible',
  'getFormModel' // 获取表单模型
]

export const isReg = value => value instanceof RegExp

/**
 *
 */
export class FormStore {
  constructor(forceUpdate, {initialValues = {}, watch}) {
    this.FormUpdate = forceUpdate // form 的更新函数
    this.model = {} // 表单状态
    this.control = {} // 控制每个FormItem
    this.isSchedule = false
    this.callback = {} // 存放监听函数
    this.penddingValidateQueue = [] // 批量更新队列
    this.defaultFormValue = initialValues // 表单初始化的值
    this.limitStateKeys = ['value', 'visible', 'rule', 'required'] // 获取字段状态时，呈现给用户可操作的值
    this.watch = watch // 监听事件注册
    this.watchValueKeys = [] // 监听value值变化的事件keys
    this.watchVisibleKeys = [] // 监听visible值变化的事件keys
    this.initWatchRelate(watch)
  }

  // 初始化时收集 watch 类型
  initWatchRelate(watch) {
    const keys = Object.keys(watch)
    const valueKeys = []
    const visibleKeys = []
    if(Object.keys(watch)?.length) {
      keys.forEach(key => {
        const [name, type] = key.split('.')
        if(type === 'value') {
          valueKeys.push(name)
        } else if(type === 'visible') {
          visibleKeys.push(name)
        }
      })
      this.watchValueKeys = valueKeys
      this.watchVisibleKeys = visibleKeys
    }
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
    const { value, rule, required, message, visible, hidden, isContainer, ...rest } =
      validate
    return {
      value,
      rule: rule || (() => true),
      required: required || false,
      message: message || '',
      status: 'pending',
      visible,
      hidden, // todo
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
      this.setFieldValue(item, this.model[item]?.value)
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
    if (controller) controller?.changeValue({ ...this.model[name] })
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
      }
    })
  }

  // 设置一组字段状态
  setFields(object) {
    if (typeof object !== 'object') return
    Object.keys(object).forEach(modelName => {
      this.setFieldValue(modelName, object[modelName].value)
    })
  }

  // 设置字段显隐
  // setFieldVisible(name, visible) {
  //   this.model[name].visible = visible
  // }

  // 给用户使用的字段属性集合
  getLimitFieldState(model) {
    // const model = state || this.model[name]
    if (!model) return null
    const newState = {}
    for(let i in model) {
      if(this.limitStateKeys.includes(i)) {
        newState[i] = model[i]
      }
    }
    return newState
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

  triggerSetVisible(model, name) {
    if(this.watchVisibleKeys.includes(name)) {
      const fn = this.watch[name + '.visible']
      if(typeof fn === "function") {
        fn({
          value: model.value,
          visible: model.visible,
          required: model.required,
          name
        })
      }
    }
  }

  // 设置对应字段的状态 目前仅能修改这些值 value / visible / rule / required
  setFieldState(name, state) {
    const names = name.split('|')
    names.forEach(name => {
      const model = this.model[name]
      if (!model) return null
      const newState = this.getLimitFieldState(state)
      const newModel = Object.assign(model, newState)
      if(newState.visible !== undefined) {
        console.log(newState)
        this.triggerSetVisible(newModel, name)
      }
      model.status = 'pendding'
      this.model[name] = newModel
      this.notifyChange(name)
    })
  }

  // 获取字段状态
  getFieldState(name) {
    if (!this.model[name]) return null
    return this.getLimitFieldState(this.model[name])
  }

  // 设置对应字段的value值
  setFieldValue(name, modelValue) {
    const model = this.model[name]
    if (!model) return false
    this.setValueClearStatus(model, name, modelValue)
    if(this.watchValueKeys.includes(name)) {
      const fn = this.watch[name + '.value']
      if(typeof fn === "function") {
        fn({
          value: model.value,
          visible: model.visible,
          required: model.required,
          name
        })
      }
    }
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
  
    // 获取单个字段模型  message组件里需用到
    getFieldModel(name) {
      const model = this.model[name]
      return model ? model : {}
    }

  // 获取表单数据层的值
  getFormValue() {
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

  /* 单一表单单元项验证 */
  validateFieldValue(name, forceUpdate = false, isChangeResponsiveField) {
    let errMsg = '此字段必填'
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
      errMsg = '此字段不符合正则校验规则'
    } else if (typeof rule === 'function') {
      /* 自定义校验规则 */
      status = rule(value) ? 'resolve' : 'reject'
      errMsg = '此字段不符合校验规则'
    }
    model.status = status
    if (lastStatus !== status || forceUpdate) {
      const notify = this.notifyChange.bind(this, name, isChangeResponsiveField)
      this.penddingValidateQueue.push(notify)
    }
    this.scheduleValidate()
    return { status, message: status === 'reject' ? errMsg : null  }
  }
  
  /* 表单整体验证 */
  validateFields(callback) {
    let status = true
    const error = []
    Object.keys(this.model).forEach(modelName => {
      // 不对容器 或 隐藏字段校验
      if (!this.model[modelName]?.isContainer && this.model[modelName]?.visible) {
      console.log(this.model[modelName])
      const modelStates = this.validateFieldValue(modelName, true, false)
        if (modelStates?.status === 'reject') {
          status = false
          error.push({ name: this.model[modelName]?.label, msg: modelStates.message })
        }
      }
    })
    callback({status, message: status ? null : error})
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
  /* 提交表单 */
  submit(cb) {
    // 对表单进行校验
    console.log(this.callback, 'this.callback')
    this.validateFields(res => {
      const { onFinish, onFinishFailed } = this.callback
      if (typeof cb !== 'function') throw new Error('提交参数必须是一个函数')
      if (!res.status) {
        onFinishFailed && typeof onFinishFailed === 'function' && onFinishFailed({errorFields: res?.message}) /* 验证失败 */
        cb({ success: false, msg: '校验失败', errData: res?.message })
      } else {
        const formData = this.getFormValue()
        onFinish && typeof onFinish === 'function' && onFinish(formData) /* 验证成功 */
        cb({ success: true, msg: '校验成功', data: formData })
      }
    }, false)
  }
}
