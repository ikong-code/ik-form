import { useState } from 'react'
import { DownLine, RightLine } from '@xm/icons-xeditor/dist/react'
import classnames from 'classnames'
import './index.less'

interface IProps {
  label: string | number
  children: React.ReactNode
}

const XCollapse = (props: IProps) => {
  const { label, children } = props
  const [show, setShow] = useState<boolean>(true)

  return (
    <div className="xcollapse-container">
      {label && (
        <div className="xcollapse-container__header" onClick={() => setShow(!show)}>
          <span>{label}</span>
          {show ? <DownLine /> : <RightLine />}
        </div>
      )}
      <div className={classnames('xcollapse-container__content', { show })}>{children}</div>
    </div>
  )
}

export default XCollapse
