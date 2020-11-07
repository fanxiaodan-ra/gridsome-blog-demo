<template>
  <div>
    <el-card shadow="never">
        <!--  v-if="item.meta&&item.meta.type=='user'&&(token||!item.meta.LoginRequired)&&(!mini||!item.meta.mini)"-->
      <el-menu :default-active="active" @select="onSelect">
          <el-menu-item v-for="item in constantRouterMap"
            :key="item.path" :index="item.path">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
      </el-menu>
    </el-card>

    <el-card shadow="never" style="margin-top: 20px;text-align: center">
      <div v-if="!token" style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
        <el-tag type="danger" size="small">&nbsp;</el-tag>&nbsp;&nbsp; Token未绑定&nbsp;&nbsp;
        <el-button type="text" @click="openTokenDialog">绑定</el-button>
      </div>
      <div v-if="token" style="font-size: 0.9rem;line-height: 1.5;color: #303133;">
        <el-tag type="success" size="small">&nbsp;</el-tag>&nbsp;&nbsp; Token已绑定&nbsp;&nbsp;
        <el-button type="text" @click="cancellation">注销</el-button>
      </div>
      <div style="margin-top: 10px;text-align: left">
        <el-alert title="Token获取" type="info" description="在 github-> settings-> developerSettings-> personalAccessTokens 勾选gist权限,获取Token. 详情参考README.md"
            :closable="false">
        </el-alert>
      </div>
    </el-card>
    <token-dialog ref="tokenDialog"></token-dialog>
  </div>
</template>

<script>
    import TokenDialog from './TokenDialog.vue'
    import events from '../../common/events'
    import { metaConfig } from '../../common/barConfig.js'

    export default {
        components: {
            TokenDialog
        },
        data() {
            return {
                active: "",
                parentUrl: "",
                menuList: [],
                token: '',
                mini: false,
            }
        },
        computed: {
            constantRouterMap () {
                const routes = this.$router.options.routes
                let result = []
                for (let key in metaConfig) {
                    let item = routes.find(i => i.name === key)
                    result.push({
                        path: item.path,
                        meta: metaConfig[key]
                    })
                }
                return result
            }
        },
        mounted() {
            this.token = localStorage.getItem('token')
            if (!this.token) {
                events.$on('refreshToken', () => {
                    this.token = localStorage.getItem('token')
                })
            }
            let arr = this.$route.path.split("/")
            this.active = "/" + arr[1] + "/" + arr[2]
            
        },
        methods: {
            onSelect(index) {
                const paramsIndex = index.indexOf(':')
                let path = paramsIndex > 0 ? index.substring(0, paramsIndex) : index
                this.$router.push(path)
            },
            openTokenDialog() {
                this.$refs.tokenDialog.open(() => {
           
                })
            },
            cancellation() {
                localStorage.removeItem('token')
                events.$emit('refreshToken')
                this.$notify({
                    title: '注销成功',
                    message: 'Token注销成功',
                    type: 'success'
                })
            }
        }
    }
</script>