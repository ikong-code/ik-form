import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { XForm } from './components'
import useForm from './hooks/useForm'
import { schema, xlinkargs} from './mock'
import 'antd/dist/antd.css'
import './index.less'

const Setters = () => {
  const form = useForm({
    components: {},
    initialValues: {},
    watch: {}
  })
  // const form = React.useRef(null)
  const watchEffects = {
    inputName: (field) => {
      form.current.setFieldState('copyName', { value: field.value })
    }
  }
 
  const handleClick = () => {
    form.submit((res) => {
      console.log(res)
      alert(JSON.stringify(res))
    })
  }

  console.log(form, 'index.tsx form')
  return (
    <div className="setters-container">
      <XForm
        form={form}
        initialValues={{}}
        schema={schema}
        watch={watchEffects}
        xlinkages={xlinkargs}
        // onResponsive={handleResponsiveFieldValue}
      >
        <Button onClick={form.resetFields}>重置</Button>
        <Button onClick={handleClick}>提交</Button>
      </XForm>
    </div>
  )
}

export default Setters
