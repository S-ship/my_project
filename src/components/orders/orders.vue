<template>
  <div>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row >
            <el-col :span="18">
                <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" :clear="getOrderList">
                    <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                </el-input>
            </el-col>
            <el-col></el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price" width="150px"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status" width="150px">
            <el-tag v-if="orderList.pay_status === 0" type="danger" size="mini" effect="dark">未付款</el-tag>
            <el-tag v-else type="success" size="mini" effect="dark">已付款</el-tag>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send" width="150px">
          </el-table-column>
          <el-table-column label="下单时间" prop="create_time" width="150px">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderList"></el-button>
              <el-button type="success" icon="el-icon-location-information" size="mini" @click="ordersSendInfo(scope.row.order_id)"></el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="editOrderVisible" width="50%" @close="editOrderClosed">
      <el-form label-width="90px" :model="editAddress" :rules="editAddressRules" >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="selectedId"
            :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddress.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流进度" :visible.sync="proggressVisible" width="50%">
      <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in progressData"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proggressVisible = false">取 消</el-button>
        <el-button type="primary" @click="proggressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata'
export default {
  data () {
    return {
      total: 0,
      editOrderVisible: false,
      proggressVisible: false,
      reverse: false,
      cityData,
      orderList: [],
      selectedId: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      progressData: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ],
      editAddress: {
        address1: [],
        address2: ''
      },
      editAddressRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    editOrderList () {
      this.editOrderVisible = true
    },
    editAddressConfirm () {
      this.editOrderVisible = false
    },
    editOrderClosed () {
      this.editAddress.address2 = ''
      this.selectedId = ''
    },
    ordersSendInfo () {
      this.proggressVisible = true
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
</style>
