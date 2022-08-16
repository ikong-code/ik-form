interface IProps {
  status: string
  message: string
  required: boolean
  name: string
  value: string | number | boolean
}

function Message(props: IProps) {
  const { status, message, required, name, value } = props
  let showMessage: string | null = ''
  let color = '#fff'
  if (required && !value && status === 'reject') {
    showMessage = `此字段为必填项`
    color = 'red'
  } else if (status === 'reject') {
    showMessage = message
    color = 'red'
  } else if (status === 'pendding') {
    showMessage = null
  } else if (status === 'resolve') {
    // showMessage = "校验通过"
    // color = "green"
  }
  return (
    <div className="form-message">
      <span style={{ color }}>{showMessage}</span>
    </div>
  )
}

export default Message
