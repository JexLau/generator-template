<template>
  <div class="page page-orders column no-wrap wait_station">
    <!-- <div class="header">
      <el-button type="primary" @click="add_station">ADD WAREHOUSE</el-button>
    </div> -->
    <std-table-test :columns="columns" :list="list" :showPager="true" :total="total" :page="page" :perpage="perpage"
      @getList="get_list" @change_perpage="change_perpage" @change_page="change_page" @edit_click="edit_click"
      @delete_click="delete_click">
    </std-table-test>

    <std-dialog ref="add_edit_station" @close="dialogEditClose" style="width: 400px">
      <div slot="header" v-if="dialogActionAdd">ADD WAREHOUSE INFOMATION</div>
      <div slot="header" v-else>EDIT WAREHOUSE INFOMATION</div>
      <div slot="footer">
        <button class="button" @click="$refs['add_edit_station'].trigger()">cancle</button>
        <button class="button" @click="add_station_info" v-if="dialogActionAdd">add</button>
        <button class="button" @click="edit_station_info" v-else>edit</button>
      </div>
      <el-form ref="form" label-width="300px" label-position="left">
        <el-form-item label="name">
          <el-input v-model="selectedItem.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="scope">
          <!-- <el-select v-model="selectedItem.scope" clearable  class="selectVehicle">
            <el-option v-for="(item) in allScope" :key="item" :label="item" :value="item"></el-option>
          </el-select> -->
          <el-input v-model="selectedItem.scope" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="map_info">
          <div class="row no-wrap">
            <el-select v-model="selectedItem.fms_map_id" filterable class="stationConItem" @change="mapChange"
              placeholder="please select map">
              <el-option v-for="item1 in map_list" :key="item1.id" :label="item1.name" :value="item1.id"></el-option>
            </el-select>
            <el-select style="margin-left:10px;" v-model="selectedItem.fms_station_id" filterable class="stationConItem"
              :disabled="selectedItem.fms_map_id === ''" placeholder="please select station">
              <el-option v-for="item1 in stationList[selectedItem.fms_map_id]" :key="item1.name" :label="item1.name"
                :value="parseInt(item1.id)"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="status">
          <el-select v-model="selectedItem.status" clearable class="selectVehicle" placeholder="please select status">
            <el-option v-for="(item) in statusEnum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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
      /** 库位信息列表 */
      list: [],
      /** 添加弹窗 */
      dialogActionAdd: false,
      /** 新增/编辑数据 */
      selectedItem: {
        id: '',
        name: '',
        scope: '',
        fms_map_id: '',
        fms_station_id: '',
        status: '',
      },
      /** table columns */
      columns: [],
      allScope: [],
      /** 站点列表 */
      stationList: [],
      /** 地图列表 */
      map_list: [],
      /** 状态Enum */
      statusEnum: [
        {
          label: "OCCUPY",
          value: "OCCUPY"
        },
        {
          label: "IDLE",
          value: "IDLE"
        },
        {
          label: "AGV_LOCK",
          value: "AGV_LOCK"
        },
      ],
    };
  },
  mounted() {
    this.get_list();
    this.get_map_list();
    this.get_scope_list();
  },
  watch: {
    'selectedItem.fms_map_id'(newVal, oldVal) {
      if (newVal) {
        this.mapChange()
      }
    },
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
        .catch((_) => {
          this.errorTip('search failed');
        });
    },
    get_scope_list() {
      this.$api['reverso/listAllScope']({})
        .then((res) => {
          this.allScope = res.data.data
        })
        .catch((err) => {
          this.allScope = []
        })
    },
    mapChange() {
      let map_id = this.selectedItem["fms_map_id"];
      if (typeof this.stationList[map_id] === "undefined") {
        this.$api["map/item"]({ id: map_id }).then(res => {
          this.$set(this.stationList, map_id, res.data.content.data.station);
        });
      }
    },
    get_map_list() {
      this.$api["map/list"]({
        page: -1,
        active_state: "ACTIVE"
      }).then(res => {
        this.map_list = res.data.maps || [];
      });
    },
    add_station() {
      this.dialogActionAdd = true;
      this.$refs['add_edit_station'].open();
    },
    add_station_info() {
      this.$api['reverso/add']({
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        scope: this.selectedItem.scope,
        fms_map_id: this.selectedItem.fms_map_id,
        fms_station_id: this.selectedItem.fms_station_id,
        status: this.selectedItem.status,
      })
        .then((res) => {
          this.get_list();
          this.$refs['add_edit_station'].trigger();
          this.successTip('operation completed');
        })
        .catch((_) => {
          this.errorTip('operation failed');
        });
    },
    edit_click(data) {
      this.dialogActionAdd = false;
      this.selectedItem = JSON.parse(JSON.stringify(data));
      this.$refs['add_edit_station'].open();
    },
    edit_station_info() {
      this.$api['reverso/update']({
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        scope: this.selectedItem.scope,
        fms_map_id: this.selectedItem.fms_map_id,
        fms_station_id: this.selectedItem.fms_station_id,
        status: this.selectedItem.status,
      })
        .then((res) => {
          this.get_list();
          this.$refs['add_edit_station'].trigger();
          this.successTip('operation completed');
        })
        .catch((_) => {
          this.errorTip('operation failed');
        });
    },
    delete_click(data) {
      this.deleteTip(
        'Are you sure to delete this data?',
        (_) => {
          this.delete_config_manager(data.id);
        }
      );
    },
    delete_config_manager(id) {
      this.$api['reverso/delete']({ id: id })
        .then((res) => {
          this.get_list();
          this.successTip('operation completed');
        })
        .catch((_) => {
          this.errorTip('operation failed');
        });
    },
    dialogEditClose() {
      this.selectedItem = {
        id: '',
        name: '',
        scope: '',
        fms_map_id: '',
        fms_station_id: '',
        status: '',
      };
    },
    get_status(val) {
      const item = this.statusEnum.find(item => item.value == val);
      return item ? item.label : ""
    },
  },
};
</script>

<style lang="scss">
.collapse {
  .el-collapse {
    border-top: none;
  }

  .el-collapse-item {
    .el-collapse-item__header {
      color: #696a71;
      line-height: 19px;
      height: 36px;
      border-bottom: 1px solid #ced0d8;
      font-size: 14px;
      margin-top: 10px;
      font-weight: normal;
    }
  }
}

.log-btn {
  width: 50%;
  float: right;
  text-align: right;
  padding-right: 10px;
}

.btn_group {
  width: 100%;
  overflow: hidden;

  .btn_item {
    float: left;
    width: 30%;
  }
}

.header {
  display: flex;
  justify-content: space-between;
}
</style>
