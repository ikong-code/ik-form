import { Button } from 'antd'
import classnames from 'classnames'
import { SelectOptions } from '../../../types'
import './index.less'

const XButtonGroup = ({ value, options = [], onChange }: any) => {
  return (
    <div className="row btn-group">
      {options.map((i: SelectOptions) => {
        // 针对 boolean 值情况
        if (typeof i.value === 'boolean') {
          return (
            <Button
              key={Math.random()}
              className={classnames({ active: +value === +i.value })}
              onClick={() => onChange(!!i.value)}
            >
              {i.label}
            </Button>
          )
        }
        return (
          <Button
            key={Math.random()}
            className={classnames({ active: value === i.value })}
            onClick={() => onChange(i.value)}
          >
            {i.label}
          </Button>
        )
      })}
    </div>
  )
}

export default XButtonGroup
