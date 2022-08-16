import React, { useRef, useState } from 'react'
import { Modal } from 'antd'
// todo fix type
// @ts-ignore
import type { ModalProps } from 'antd'
import { XForm } from '../components/index'

// modalProps 弹窗参数具体参考 antd modal https://ant.design/components/modal-cn/

const useXFormModal = (props: any) => {
  const { initialValues, schema, title = '弹窗标题', width = 600, ...modalProps } = props
  const [visiable, setVisiable] = useState(false)
  const open = () => {
    setVisiable(true)
  }
  const close = () => {
    setVisiable(false)
  }

  const FormModal = ({ onSubmit }) => {
    const [confirmLoading, setConfirmLoading] = useState(false)

    const formRef = useRef(null)
    const onCancel = () => {
      close()
    }

    const handleSubmit = () => {
      setConfirmLoading(true)
      formRef.current.submit(res => {
        const { data = {} } = res
        onSubmit(data)
        close()
        setConfirmLoading(false)
      })
    }
    return (
      <Modal
        onCancel={onCancel}
        onOk={handleSubmit}
        title={title}
        visible={visiable}
        wrapClassName="form-modal-wrap"
        okText="提交"
        width={width}
        confirmLoading={confirmLoading}
        {...modalProps}
      >
        <XForm
          key={Math.random()}
          initialValues={initialValues}
          schema={schema}
          onResponsive={false}
          ref={formRef}
        />
      </Modal>
    )
  }

  return {
    FormModal,
    open
  }
}

export default useXFormModal
