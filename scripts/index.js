const { baseTableConfig } = require("./base-table.config");
const fs = require("fs");
const path = require("path");

const baseTablePath = path.resolve(__dirname, "./base-table.vue")
const baseTableData = fs.readFileSync(baseTablePath, "utf8");
let result
// 替换数据
// 1. column：columns: [],
result = baseTableData.replace(/columns: \[\]/g, `columns: ${JSON.stringify(baseTableConfig.columns)}`)
// 2. 替换api
result = result.replace(/example/g, baseTableConfig.apiModuleName)
// 3. 替换按钮文本
result = result.replace(/信息/g, baseTableConfig.btnText)
// 4. 替换selectedItem
// 洗一下selectedItem数据
const selectedItem = Object.keys(baseTableConfig.selectedItem).reduce((k, v) => ({ ...k, [v]: "" }), {})
result = result.replace(/selectedItem: \{\}/g, `selectedItem: ${JSON.stringify(selectedItem)}`)
// 5. 插入新增、编辑的数据
// 遍历一下selectedItem获取数据的类型
let formItem = "";
const settings = baseTableConfig.selectedItem;
for (let key in settings) {
  console.log(settings[key])
  if (!settings[key].hidden) {
    if (settings[key].type == "input") {
      formItem += `<el-form-item label=${settings[key].label}>
        <el-input v-model="selectedItem.${key}" style="width: 350px" placeholder="请输入..."></el-input>
      </el-form-item>`
    }
  }
}
result = result.replace(/<!-- @add_edit_form -->/g, formItem)

// 6. 替换 edit_click 和 delete_click 
// 暂时没有定制化需求，先空着
// result = baseTableConfig.edit_click ? "" : ""

saveFile(result)









function saveFile(data) {
  fs.writeFileSync(path.resolve(__dirname, "./create-base-table.vue"), data, { encoding: 'utf-8' })
}