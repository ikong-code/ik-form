// todo fix type
// @ts-ignore
import Space from '../../AtomComponents/Space'
import XInput from '../../AtomComponents/XInput'
import useXFormModal from '../../../hooks/useXFormModal'
import { EditorLine } from '@xm/icons-xeditor/dist/react'
import { schema } from './schema'
import './index.less'

const JumpLink = ({ value, onChange }) => {
  const modalProps = {
    initialValues: {},
    schema,
    title: '编辑操作',
    cancelText: '取消',
    okText: '确定',
    width: 480
  }
  const { FormModal, open } = useXFormModal(modalProps)

  return (
    <div className="jumplink">
      <Space>
        <XInput value={value.linktext} placeholder="请输入" disabled={true} />
        <XInput value={'http://baidu.com'} placeholder="请输入" disabled={true} />
        <EditorLine onClick={open} />
      </Space>
      <FormModal onSubmit={onChange} />
    </div>
  )
}

export default JumpLink
