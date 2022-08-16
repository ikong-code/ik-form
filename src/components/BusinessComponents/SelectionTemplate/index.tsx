import { CheckthenumberLine } from '@xm/icons-xeditor/dist/react'
import classnames from 'classnames'
import './index.less'

const mock = new Array(6).fill('').map((i, idx) => ({ id: idx + 1, name: '容器标题' }))

const SelectionTemplate = ({ value, options = [], onChange }: any) => {
  return (
    <div className="selection-template">
      {mock.map((i: any) => {
        return (
          <div
            key={i.id}
            className={classnames('selection-template__item', { active: value === i.id })}
            onClick={() => onChange(i.value)}
          >
            {value === i.id && (
              <div className={'choose'}>
                <CheckthenumberLine />
              </div>
            )}
            {i.label}
          </div>
        )
      })}
    </div>
  )
}

export default SelectionTemplate
