<template>
  <div>
    <Layout>
      <div style="min-height: 600px">
        <el-card shadow="never" style="min-height: 400px" v-if="blog">
            <div slot="header">
              <span>{{blog.title}}</span>
            </div>
            <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
              发布 {{blog.createTime}}
              <br> 更新 {{blog.updateTime}}
            </div>
            <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;border-bottom: 1px solid #E4E7ED;padding: 5px 0px 5px 0px">
              <pre style="font-family: '微软雅黑'">{{blog.description}}</pre>
            </div>
            <div v-html="blog.content" class="markdown-body" style="padding-top: 20px"></div>
        </el-card>
        <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-if="!blog.id">
          <font style="font-size: 30px;color:#dddddd ">
            <b>没有更新 ╮(๑•́ ₃•̀๑)╭</b>
          </font>
        </el-card>
      </div>
    </Layout>
  </div>
</template>

<static-query>
query {
  allBlogGists {
    edges {
      node {
        id
        title
        content
        description
        createTime
        updateTime
      }
    }
  }
}
</static-query>
<script>
export default {
  name: 'ArticlePage',
  metaInfo: {
    title: '最新状态'
  },
  data() {
    return {
      query: {
        page: 1,
        pageSize: 1
      },
      loading: false,
    }
  },
  computed: {
    blog () {
      const node = this.$static.allBlogGists.edges[0].node
      return {
        id: node.id,
        title: node.title,
        content: node.content,
        // content: node.content,
        description: node.description,
        createTime: this.$util.utcToLocal(node.createTime),
        updateTime: this.$util.utcToLocal(node.updateTime)
      }
    }
  }
}
</script>
<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

/* .layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
} */
</style>
