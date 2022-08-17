import React from 'react'
import { FormStore } from '../utils/formStore'

const useForm = ({schema = [], initialValues = {}, components = {}, watch = {}}: any) => {
  const formRef = React.useRef(null)
  const [, forceUpdate] = React.useState({})

  if (!formRef.current) {
    const formStoreCurrent = new FormStore(forceUpdate, { initialValues, watch })
    formRef.current = formStoreCurrent.getForm()
    formRef.current.customRegisterComps = components || {};
    formRef.current.schema = schema
  }
  return formRef.current
}

export default useForm
