const baseTableConfig = {
  columns: [{
    title: '品类名称',
    key: 'nickname',
  },
  {
    title: '操作',
    type: 'operate',
    width: 300,
    operates: [
      {
        name: '编辑',
        emitKey: 'edit_click',
        type: 'warning',
        width: 80,
      },
      {
        name: '删除',
        emitKey: 'delete_click',
        type: 'danger',
        width: 80,
      },
    ]
  }],
  /** api请求模块名 */
  apiModuleName: "c300/category",
  /** 新增/编辑数据 */
  selectedItem: {
    id: {
      hidden: true,
    },
    nickname: {
      label: "品类名称",
      type: "input"
    },
  },
  btnText: "品类信息"
  // 自定义edit_click函数，有默认处理函数，不需要可以不传
  // edit_click: () => {  },
  // 自定义delete_click函数，有默认处理函数，不需要可以不传
  // delete_click: () => { console.log("delete_click") },
}

exports.baseTableConfig = baseTableConfig