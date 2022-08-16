// todo fix type
// @ts-ignore
import type { UploadProps } from 'antd'
import { Button, message, Upload } from 'antd'
import { UploadLine } from '@xm/icons-xeditor/dist/react'
// todo fix type
// @ts-ignore
import Empty from '../../../assets/images/empty.png'
import './index.less'

const XUploadImg = ({ value, action = '', maxCount = 1, onChange, ...rest }) => {
  const props: UploadProps = {
    maxCount: typeof maxCount === 'number' ? maxCount : 1,
    action: action || 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    beforeUpload: file => {
      const isPNG = file.type === 'image/png'
      if (!isPNG) {
        message.error(`${file.name} is not a png file`)
      }
      // todo fix type
      // @ts-ignore
      return isPNG || Upload.LIST_IGNORE
    },
    onChange: info => {
      if (info[0].status === 'uploading') {
        console.log(info[0].name, 'uploading')
      }
      if (info[0].status === 'done') {
        console.log(info.fileList, 'info.fileList')
        // onChange()
      }
    },
    ...rest
  }
  return (
    <div className="xupload-container">
      <div className="xupload-container__upload">
        <Upload {...props}>
          {/* todo fix type*/}
          {/* @ts-ignore*/}
          <Button icon={<UploadLine />}>上传图片</Button>
        </Upload>
      </div>
      <div className="xupload-container__showImg">
        <img src={value || Empty} />
      </div>
    </div>
  )
}

export default XUploadImg
