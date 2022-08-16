export const schema = [
  {
    key: 'linktext',
    type: 'XInput',
    required: true,
    defaultValue: '查看更多',
    ui: {
      label: '操作名称',
      labelWidth: 80
    },
    props: {
      placeholder: '请输入'
    }
  },
  {
    key: 'linkoperate',
    type: 'XSelectLinkage',
    required: true,
    // defaultValue: "查看更多",
    ui: {
      label: '操作类型',
      labelWidth: 80
    }
  }
]
