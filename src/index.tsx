import { Button } from 'antd'
import { XForm } from './components'
import useForm from './hooks/useForm'
import { schema, schema2 } from './mock'
import 'antd/dist/antd.css'
import './index.less'

const Example = () => {
  const watchEffects = {
    'firstName.value': (field) => {
      console.log(field)
      // formInstance.setFieldState('copyName', { visible: false })
      formInstance.setFieldState('secondName', { visible: +field.value === 1 })
    },
    'secondName.visible': (field) => {
      console.log(field, 'field.visible')
      formInstance.setFieldState('thirdName|fourthName', { visible: !field.visible })
    },
  }

  const handleResponsiveFieldValue = (val) => {
    console.log(val, 'val')
  }

  const formInstance = useForm({
    schema: schema,
    components: {},
    watch: watchEffects,
    onResponsive: handleResponsiveFieldValue
  })
  const formInstance2 = useForm({
    schema: schema2,
    initialValues: { inputName1: 'input name', secondName2: 'copy name'},
    watch: watchEffects,
    onResponsive: handleResponsiveFieldValue
  })
 
  const handleClick = () => {
    formInstance.submit((res) => {
      console.log(res)
      alert(JSON.stringify(res))
    })
  }

  // 提交表单且数据验证成功后回调事件
  const handleFinish = (values) => {
    console.log(values)
  }

  // 提交表单且数据验证失败后回调事件
  const handleFinishFailed = (values) => {
    // function({ values, errorFields })
    console.log(values)
  }

  return (
    <div className="setters-container">
      <XForm form={formInstance}>
        <Button onClick={formInstance.resetFields}>重置</Button>
        <Button onClick={handleClick}>提交</Button>
      </XForm>

      <XForm form={formInstance2} onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}>
        <Button onClick={formInstance2.resetFields}>重置</Button>
        <Button onClick={()=>{formInstance2.submit(res => {
          console.log(res)
          alert(JSON.stringify(res))
        })}}>提交</Button>
      </XForm>
    </div>
  )
}

export default Example
