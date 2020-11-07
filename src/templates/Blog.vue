<template>
  <div>
    <Layout>
      <div style="min-height: 600px" v-loading="loading">
        <el-card shadow="never" style="margin-bottom: 20px">
          <el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
          <el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
          <el-button @click="$share()" style="margin-left: 10px" icon="el-icon-share" type="warning" plain circle></el-button>
          <el-button type="primary" icon="el-icon-edit" round plain style="float: right;" @click="goAdd">写博文</el-button>
        </el-card>
        <div v-if="blogs&&blogs.length>0">
            <el-card shadow="hover" v-for="(item,index) in blogs" :key="'p'+index" style="margin-bottom: 20px" v-if="!item.hide">
                <div slot="header">
                    <el-row>
                        <el-col :span="16">
                            <span>
                                <a style="text-decoration:none;cursor:pointer" @click="goDetails(item.id)">
                                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp; {{item.title}}
                                </a>
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: right;">
                                <el-button @click="$share('/user/blog/details/'+item.id)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
                                <el-button @click="editBlog(index)" style="padding: 3px 0" type="text" icon="el-icon-edit" v-if="token"></el-button>
                                <el-button @click="deleteBlog(index)" style="padding: 3px 0" type="text" icon="el-icon-delete" v-if="token"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                    最近更新 {{item.updateTime}}
                </div>
                <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 10px 0px 0px 0px">
                    {{item.description}}
                </div>
            </el-card>
            <div style="text-align: center">
                <el-pagination @current-change="list" background layout="prev, pager, next" :current-page.sync="currentPage" :page-size="pageNumber"
                    :total="pageNumber * totalPages">
                </el-pagination>
            </div>

        </div>

        <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-if="!blogs||blogs.length==0">
            <font style="font-size: 30px;color:#dddddd ">
                <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
            </font>
        </el-card>
      </div>
    </Layout>
  </div>
</template>
<page-query>
query {
  allArticles(sort: {order: ASC}) {
    edges {
      node {
        id
        title
        description
        created_at
        updated_at
        totalPage
      }
    }
  }
}
</page-query>
<script>
import axios from 'axios'
import configuration from '../../static/configuration.json'
import events from '../common/events'

export default {
  data () {
    return {
      blogs: [],
      currentPage: 1,
      totalPages: 1,
      pageNumber: 5,
      searchKey: "",
      blogs: [],
      loading: true,
      token: ''
    } 
  },
  mounted () {
    this.totalPages = this.$page.allArticles.edges[0].node.totalPage
    this.blogs = this.$page.allArticles.edges.map(i => {
        i.node.hide = false
        i.node.createTime = this.$util.utcToLocal(i.node.created_at)
        i.node.updateTime = this.$util.utcToLocal(i.node.updated_at)
        return i.node
    })
    this.token = localStorage.getItem('token')
    if (!this.token) {
      events.$on('refreshToken', () => {
        this.token = localStorage.getItem('token')
      })
    }
    this.loading = false
  },
  methods: {
    searchTitle (files) {
      let keyResult 
      for (let key in files) {
        keyResult = key
      }
      return keyResult
    }, 
    async list (e) {
        this.currentPage = e
        const { data } = await axios.get(`https://api.github.com/users/${configuration.githubUsername}/gists?page=${this.currentPage}&per_page=5`)
        this.blogs = data.map(i => {
            return {
                id: i.id,
                created_at: i.created_at,
                updated_at: i.updated_at,
                title: this.searchTitle(i.files),
                description: i.description,
                hide: false
            }
        })

    },
    search() {
        const list = JSON.parse(JSON.stringify(this.blogs))
        for (let i = 0; i < list.length; i++) {
            
            list[i].hide = list[i].title.indexOf(this.searchKey) < 0
        }
        this.blogs = list
    },
    goAdd() {
        if (!this.token) {
            this.$message({
                message: '请绑定有效的Token',
                type: 'warning'
            })
            return
        }
        this.$router.push('/add')
    },
    editBlog(index) {
        // if (!this.token) {
        //     this.$message({
        //         message: '请绑定有效的Token',
        //         type: 'warning'
        //     })
        //     return
        // }
        this.$router.push('/user/blog/edit/' + this.blogs[index].id)
    },
    deleteBlog(index) {
        // this.$confirm('是否永久删除该博客?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        // }).then(() => {
        //     let blog = this.blogs[index]
        //     GistApi.delete(blog.id).then((result) => {
        //         this.$message({
        //             message: '删除成功',
        //             type: 'success'
        //         })
        //         this.blogs.splice(index, 1)
        //     })
        // })
    },
    goDetails(id) {
        this.$router.push(`/article/${id}`)
    }
  }
}
</script>