import React from 'react'
import { FormStore } from '../utils/formStore'

const useForm = ({defaultFormValue = {}, xlinkages = [], components = {}, watch = {}}: any) => {
  const formRef = React.useRef(null)
  const [, forceUpdate] = React.useState({})

  if (!formRef.current) {
    // if (form) {
    //   formRef.current = form
    // } else {
    const formStoreCurrent = new FormStore(forceUpdate, defaultFormValue, xlinkages)
    formRef.current = formStoreCurrent.getForm()
    formRef.current.components = components || {}
    // }
  }
  return formRef.current
}

export default useForm
