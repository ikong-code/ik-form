import { useMemo } from 'react'
import { CircleAquestionmarkLine } from '@xm/icons-xeditor/dist/react'
import { Tooltip, Switch } from 'antd'
import Space from '../AtomComponents/Space'
import { LabelProps } from '../../types'

const Label = ({ children, required = false, ui, operationVal, onChange }: LabelProps) => {
  const {
    labelWidth = 80,
    height = 32,
    label,
    labelAlign = 'top',
    tooltip,
    openSwitch = false, // 默认不展示switch组件
    extra = null,
    checkedChildren = '开启',
    unCheckedChildren = '隐藏'
  } = ui

  const renderTooltip = useMemo(() => {
    if (!tooltip) return null
    if (typeof tooltip === 'string') {
      return (
        <Tooltip title={tooltip}>
          <CircleAquestionmarkLine />
        </Tooltip>
      )
    }
    if (typeof tooltip === 'object') {
      const Icon = tooltip.icon || <CircleAquestionmarkLine />
      return <Tooltip title={tooltip.title}>{Icon}</Tooltip>
    }
    return null
  }, [tooltip])

  const handleChangeSwitch = val => {
    onChange(val)
  }

  const labelOperationRender = () => {
    return (
      <div className="form-label-exra">
        <Space>
          {openSwitch && (
            <Switch
              checkedChildren={checkedChildren}
              unCheckedChildren={unCheckedChildren}
              defaultChecked={operationVal}
              onChange={handleChangeSwitch}
            />
          )}
          {extra}
        </Space>
      </div>
    )
  }

  // 规则: label在上方的时候 可以配置switch开关 或 其他操作
  const renderLabelPositionTop = () => {
    return (
      <div className="form-label labelAlign " style={{ minHeight: height + 'px' }}>
        <div className="form-label-top">
          <div
            className="form-label-name"
            style={{
              width: `${labelWidth}px`
            }}
          >
            {required ? <span style={{ color: 'red', marginRight: 8 }}>*</span> : null}
            {label}:{tooltip && <div className="label-tooltip">{renderTooltip}</div>}
          </div>
          {labelOperationRender()}
        </div>
        {children}
      </div>
    )
  }

  const renderLabel = () => {
    if (labelAlign === 'top') {
      return renderLabelPositionTop()
    }

    return (
      <div className="form-label" style={{ minHeight: height + 'px' }}>
        <div
          className="form-label-name"
          style={{
            width: `${labelWidth}px`,
            textAlign: labelAlign === 'right' ? 'right' : 'left'
          }}
        >
          {required ? <span style={{ color: 'red' }}>*</span> : null}
          {label}:{tooltip && <div className="label-tooltip">{renderTooltip}</div>}
        </div>{' '}
        {children}
      </div>
    )
  }

  if (!ui.label) {
    return <div>{children}</div>
  }

  return renderLabel()
}

export default Label
