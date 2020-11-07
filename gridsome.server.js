// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require('axios')
const configuration = require('./static/configuration.json')
const host = 'https://api.github.com/'

const parseHeaders = (headers) => {
  try {
    let linkArr = headers['link'].split(",")
    for (let i = 0; i < linkArr.length; i++) {
      let temp = linkArr[i]
      if (temp.indexOf("rel=\"last\"") < 0) {
        continue
      }
      let paramArr = temp.split(/[\?&]/)
      for (let j = 0; j < paramArr.length; j++) {
        let stemp = paramArr[j]
        let kv = stemp.split("=")
        if (kv[0] != "page") {
          continue
        }
        return parseInt(kv[1])
      }
    }
  } catch (e) {

  }

  return 0
}

module.exports = function (api) {
  api.loadSource(async actions => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/

    const collection = actions.addCollection('BlogGists')
    const userCollection = actions.addCollection('UserInfo')
    const followersCollection = actions.addCollection('Followers')
    const followingCollection = actions.addCollection('Following')
    const articlesCollection = actions.addCollection('Articles')
    const projectsCollection = actions.addCollection('Projects')

    try {
      const {data} = await axios.get(`${host}users/GitHub-Laziji/gists?page=1&per_page=1`)
      const blogId = data[0]['id']
      const {data: newData} = await axios.get(`${host}gists/${blogId}`)
      for (let key in newData.files) {
        collection.addNode({
          title: key,
          content: newData.files[key]['content'],
          description: newData['description'],
          createTime: newData['created_at'],
          updateTime: newData['updated_at']
        })
      }
    } catch (e) {
      console.log(e)
    }
    

    try {
      const {data: user} = await axios.get(`${host}users/${configuration.githubUsername}`)

      userCollection.addNode({
        ...user
      })
      
      const {data: followers} = await axios.get(`${host}users/${configuration.githubUsername}/followers?page=1&per_page=9`)
    
      followers.forEach((i) => {
        followersCollection.addNode({
          ...i
        })
      })
    } catch (e) {
      console.log(e)
    }

    
    try {
      const {data: following} = await axios.get(`${host}users/${configuration.githubUsername}/following?page=1&per_page=9`)
  
      following.forEach((i) => {
        followingCollection.addNode({
          ...i
        })
      })

    } catch(e) {
      console.log(e)
    }
    
    try {
      const blogRes = await axios.get(`${host}users/${configuration.githubUsername}/gists?page=1&per_page=5`)
      const searchKey = (files) => {
        let keyResult 
        for (let key in files) {
          keyResult = key
        }
        return keyResult
      } 
      const list = blogRes.data.map(i => {
        return {
          id: i.id,
          created_at: i.created_at,
          updated_at: i.updated_at,
          title: searchKey(i.files),
          description: i.description,
          totalPage: parseHeaders(blogRes.headers)
        }
      })
      list.forEach(i => {
        articlesCollection.addNode(i)
      })
    } catch (e) {
      console.log(e)
    }
    
    try {
      const projectRes = await axios.get(`${host}users/${configuration.githubUsername}/repos?page=1&per_page=5`)
      projectRes.data.map(i => {
        projectsCollection.addNode({
          id: i.id,
          name: i.name,
          url: i.html_url,
          description: i.description,
          stargazersCount: i.stargazers_count,
          watchersCount: i.watchers_count,
          forksCount: i.forks_count,
          language: i.language,
          license: i.license.spdx_id || null,
          created_at: i.created_at,
          updated_at: i.updated_at,
          hide: false,
          totalPage: parseHeaders(projectRes.headers)})
      })
    } catch (e) { console.log(e) }
    
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
    createPage({
      name: 'social',
      path: '/social',
      component: './src/templates/Social.vue'
    })
    createPage({
      name: 'new',
      path: '/new',
      component: './src/templates/New.vue'
    })
    createPage({
      name: 'blog',
      path: '/blog',
      component: './src/templates/Blog.vue'
    })
    createPage({
      name: 'project',
      path: '/project',
      component: './src/templates/Project.vue'
    })
  })
}