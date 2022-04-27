<template>
  <div>
    <div class="header">
      <el-button type="primary" @click="add_click">添加品类信息</el-button>
    </div>
    <std-table-test :columns="columns" :list="list" :showPager="true" :total="total" :page="page" :perpage="perpage"
      @getList="get_list" @change_perpage="change_perpage" @change_page="change_page" @edit_click="edit_click"
      @delete_click="delete_click">
    </std-table-test>
    <std-dialog ref="add_edit_form" @close="dialogClose" style="width: 400px">
      <div slot="header" v-if="dialogActionAdd">添加品类信息</div>
      <div slot="header" v-else>编辑品类信息</div>
      <div slot="footer">
        <button class="button" @click="$refs['add_edit_form'].trigger()">取消</button>
        <button class="button" @click="add_info" v-if="dialogActionAdd">添加</button>
        <button class="button" @click="edit_info" v-else>编辑</button>
      </div>
      <el-form ref="form" label-width="300px" label-position="left">
        <el-form-item label=品类名称>
        <el-input v-model="selectedItem.nickname" style="width: 350px" placeholder="请输入..."></el-input>
      </el-form-item>
      </el-form>
    </std-dialog>
  </div>
</template>

<script>
import mixin from '../mixins/base_view';

export default {
  mixins: [mixin],
  data() {
    return {
      /** table data */
      list: [],
      /** table columns */
      columns: [{"title":"品类名称","key":"nickname"},{"title":"操作","type":"operate","width":300,"operates":[{"name":"编辑","emitKey":"edit_click","type":"warning","width":80},{"name":"删除","emitKey":"delete_click","type":"danger","width":80}]}],
      /** open dialog */
      dialogActionAdd: false,
      /** create/edit data */
      selectedItem: {"id":"","nickname":""}
    };
  },
  mounted() {
    this.get_list();
  },
  methods: {
    get_list() {
      this.$api['c300/category/list']({
        page: this.page,
        perpage: this.perpage,
      })
        .then((res) => {
          this.list = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch(() => {
          this.errorTip("查询失败");
        });
    },
    add_click() {
      this.dialogActionAdd = true;
      this.$refs['add_edit_form'].open();
    },
    add_info() {
      this.$api['c300/category/add']({...this.selectedItem})
        .then((res) => {
          this.get_list();
          this.$refs['add_edit_form'].trigger();
          this.successTip('新建成功');
        })
        .catch((_) => {
          this.errorTip('新建失败');
        });
    },
    edit_click(data) {
      this.dialogActionAdd = false;
      this.selectedItem = JSON.parse(JSON.stringify(data));
      this.$refs['add_edit_form'].open();
    },
    edit_info() {
      this.$api['c300/category/update']({...this.selectedItem})
        .then((res) => {
          this.get_list();
          this.$refs['add_edit_form'].trigger();
          this.successTip('更新成功');
        })
        .catch((_) => {
          this.errorTip('更新失败');
        });
    },
    delete_click(data) {
      this.deleteTip(
        '确认删除此项数据吗?，若要重新添加请联系管理员！！',
        (_) => {
          this.delete_comfire(data.id);
        }
      );
    },
    delete_comfire(id) {
      this.$api['c300/category/delete']({ id: id })
        .then((res) => {
          this.get_list();
          this.successTip('删除成功');
        })
        .catch((_) => {
          this.errorTip('删除失败');
        });
    },
    dialogClose() {
      this.selectedItem = {};
    },
  },
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
}
</style>
