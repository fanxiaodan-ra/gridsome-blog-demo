<template>
  <div>
    <Layout>
            <el-card shadow="never" style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px">
          <el-tabs v-model="activeTab" type="card" @tab-click="onSelect">
              <el-tab-pane :label="'粉丝 '+followersTotal" name="followers" style="padding: 5px">
                  <div v-loading="followers.length === 0">
                      <div v-if="followers.length ">
                          <el-row style="min-height: 200px; ">
                              <el-col :span="8" v-for="(item, index) in followers" :key="'followers'+index" style="padding: 10px">
                                  <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                      <i class="el-icon-star-off"></i>&emsp;
                                      <a @click="$router.push(`/details/${item.id}`)" style=" text-decoration:none;cursor:pointer">{{item.login}}</a>
                                      <br>
                                      <i class="el-icon-message"></i>&emsp;
                                      <a :href="item.html_url" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                      <br>
                                      <img :src="item.avatar_url" style="width: 100%;border-radius:5px;margin-top: 5px">
                                  </el-card>
                              </el-col>
                          </el-row>
                          <div style="text-align: center;margin-top: 10px">
                              <el-pagination @current-change="onSelectPage" background layout="prev, pager, next" :current-page.sync="followersCurrentPage"
                                  :page-size="9" :total="followersTotal">
                              </el-pagination>
                          </div>
                      </div>
                      <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                          <font style="font-size: 30px;color:#dddddd ">
                              <b>(￢_￢) 没有一个粉丝</b>
                          </font>
                      </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane :label="'关注 '+followingTotal" name="following" style="padding: 5px">
                  <div>
                      <div v-if="following.length">
                          <el-row style="min-height: 200px; ">
                              <el-col :span="8" v-for="(item,index) in following" :key="'following'+index" style="padding: 10px">
                                  <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                      <i class="el-icon-star-off"></i>&emsp;
                                      <a @click="$router.push(`/details/${item.id}`)" style=" text-decoration:none;cursor:pointer">{{item.login}}</a>
                                      <br>
                                      <i class="el-icon-message"></i>&emsp;
                                      <a :href="item.html_url" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                      <br>
                                      <img :src="item.avatar_url" style="width: 100%;border-radius:5px;margin-top: 5px">
                                  </el-card>
                              </el-col>
                          </el-row>
                          <div style="text-align: center;margin-top: 10px">
                              <el-pagination @current-change="onSelectPage" background layout="prev, pager, next" :current-page.sync="followingCurrentPage"
                                  :page-size="9" :total="followingTotal">
                              </el-pagination>
                          </div>
                      </div>
                      <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                          <font style="font-size: 30px;color:#dddddd ">
                              <b>(￢_￢) 还没有关注一个人</b>
                          </font>
                      </div>
                  </div>
              </el-tab-pane>
          </el-tabs>
      </el-card>    
    </Layout>
  </div>
</template>
<page-query>
query {
	userInfo: allUserInfo {
    edges {
      node {
        id
        name
        followers
        following
      }
    }
  }
  followers: allFollowers {
    edges {
      node {
        id
        login
        avatar_url
        html_url
      }
    }
  }
  following: allFollowing {
    edges {
      node {
        id
        login
        avatar_url
        html_url
      }
    }
  }
}
</page-query>
<script>
import axios from 'axios'
import configuration from '../../static/configuration.json'
export default {
  name: 'social',
  metaInfo: {
    title: '社交圈',
    meta: [
      {
        name: 'social'
      }
    ]
  },
  data() {
    return {
      activeTab: "followers",
      followersCurrentPage: 1,
      followers: [],
      followingCurrentPage: 1,
      following: []
    }
  },
  mounted() {
    this.$page.followers.edges.forEach(i => {
      this.followers.push(i.node)
    })
    this.$page.following.edges.forEach(i => {
      this.following.push(i.node)
    })
  },
  computed: {
    followingTotal () {
      return this.$page.userInfo.edges[0].node.following
    },
    followersTotal () {
      return this.$page.userInfo.edges[0].node.followers
    },
    followersProcess () {
      this.$page.followers.edges.forEach(i => {
        this.followers.push(i.node)
      })
      return this.followers
    },
    followingProcess () {
      this.$page.following.edges.forEach(i => {
        this.following.push(i.node)
      })
      return this.following
    }
  },
  methods: {
    onSelect() {

    },
    async onSelectPage(e) {
      switch (this.activeTab) {
        case "followers":

          this.followersCurrentPage = e

          const followersRes = await axios.get(`https://api.github.com/users/${configuration.githubUsername}/followers?page=${e}&per_page=9`)
          this.followers = followersRes.data
          break
        case "following":
          this.followingCurrentPage = e
          console.log(this.followingCurrentPage)
          const followingRes = await axios.get(`https://api.github.com/users/${configuration.githubUsername}/following?page=${e}&per_page=9`)
          this.following = followingRes.data
          break
        default:
          break
      }
    }
  }
}
</script>