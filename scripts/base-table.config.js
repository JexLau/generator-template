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
  apiModuleName: "reverso",
  selectedItem: {

  },
  // 自定义edit_click函数
  edit_click: () => {console.log("edit_click")},
  // 自定义delete_click函数
  delete_click: () => {console.log("delete_click")},
}

exports.baseTableConfig = baseTableConfig