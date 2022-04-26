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
// 3. 替换 edit_click 和 delete_click
result = result.replace(/console\.log\("edit_click"\)/g, `
      this.dialogActionAdd = false;
      this.selectedItem = JSON.parse(JSON.stringify(data));
      this.$refs['add_edit_form'].open();
`)
result = result.replace(/console\.log\("delete_click"\)/g, `
      this.deleteTip(
        '确认删除此项数据吗?，若要重新添加请联系管理员！！',
        (_) => {
          this.delete_comfire(data.id);
        }
      );
`)

saveFile(result)









function saveFile(data) {
  fs.writeFileSync(path.resolve(__dirname, "./create-base-table.vue"), data, { encoding: 'utf-8' })
}