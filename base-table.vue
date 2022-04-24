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
      columns: [],
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
    edit_click() {
      console.log("edit_click")
    },
    delete_click() {
      console.log("delete_click")
    },
  },
};
</script>

<style lang="scss">
</style>
