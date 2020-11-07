// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Gridsome',
  plugins: [],
  templates: {
    Followers: [
      {
        path: '/details/:id',
        component: './src/templates/Details.vue'
      }
    ],
    Following: [
      {
        path: '/details/:id',
        component: './src/templates/Details.vue'
      }
    ],
    Articles: [
      {
        name: 'article',
        path: '/article/:id',
        component: './src/templates/Article.vue'
      },
      // {
      //   name: 'edit',
      //   path: '/edit/:id',
      //   component: './src/templates/Edit.vue'
      // }
    ],
    Projects: [
      {
        name: 'pro-detail',
        path: '/pro-detail/:name',
        component: './src/templates/ProjectDetail.vue'
      }
    ]
  }
}
