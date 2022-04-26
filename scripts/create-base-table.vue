<template>
  <div>
    <std-table-test :columns="columns" :list="list" :showPager="true" :total="total" :page="page" :perpage="perpage"
      @getList="get_list" @change_perpage="change_perpage" @change_page="change_page" @edit_click="edit_click"
      @delete_click="delete_click">
    </std-table-test>
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
    };
  },
  mounted() {
    this.get_list();
  },
  methods: {
    get_list() {
      this.$api['reverso/list']({
        page: this.page,
        perpage: this.perpage,
      })
        .then((res) => {
          this.list = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch(() => {
          this.errorTip('search failed');
        });
    },
    edit_click(data) {
      this.dialogActionAdd = false;
      this.selectedItem = JSON.parse(JSON.stringify(data));
      this.$refs['add_edit_form'].open();
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
      this.$api['reverso/delete']({ id: id })
        .then((res) => {
          this.get_list();
          this.successTip('删除成功');
        })
        .catch((_) => {
          this.errorTip('删除失败');
        });
    },
  },
};
</script>

<style lang="scss">
</style>
