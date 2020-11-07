<template>
    <div style="min-height: 600px" v-loading="loading">
        <Layout>
          <el-card shadow="never" style="margin-bottom: 20px">
              <el-form ref="form" :model="form" label-width="80px" :rules="ruleValidate">
                  <el-form-item label="标题" prop="title">
                      <el-input v-model="form.title" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="简要说明" prop="description">
                      <el-input v-model="form.description" type="textarea"></el-input>
                  </el-form-item>
                  <el-form-item label="博客正文" prop="content">
                      <mavon-editor @imgAdd="imgAdd" style="max-height: 500px" ref="md" v-model="form.content" :subfield="false" :toolbars="mavonEditorToolbars"
                      />
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="onSubmit" :loading="submitButton.loading" :disabled="submitButton.disabled">修改</el-button>
                      <el-button @click="$router.push('/blog')">返回</el-button>
                  </el-form-item>
              </el-form>
          </el-card>
          <token-dialog ref="tokenDialog"></token-dialog>
        </Layout>
    </div>
</template>
<page-query>
query ($id: ID) {
  articles(id: $id) {
    id
  }
}
</page-query>
<script>
    import axios from 'axios'
    import TokenDialog from '../layouts/components/TokenDialog'
    import configuration from '../../static/configuration.json'
    export default {
        name: 'edit',
        components: {
            TokenDialog
        },
        data() {
            return {
                form: {
                    id: "",
                    title: "",
                    description: "",
                    content: ""
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { type: 'string', max: 32, message: '标题长度不大于32字符', trigger: 'change' }
                    ],
                    description: [
                        { required: true, message: '请输入博客描述', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输博客入正文', trigger: 'blur' }
                    ],
                },
                loading: true,
                submitButton: {
                    loading: false,
                    disabled: false
                },
                mavonEditorToolbars: {
                    bold: true,
                    italic: true,
                    header: true,
                    underline: true,
                    strikethrough: true,
                    mark: true,
                    superscript: true,
                    subscript: true,
                    quote: true,
                    ol: true,
                    ul: true,
                    link: true,
                    imagelink: true,
                    code: true,
                    table: true,
                    htmlcode: true,
                    trash: true,
                    alignleft: true,
                    aligncenter: true,
                    alignright: true,
                    preview: true,
                },
                token: ''
            }
        },
        mounted() {
            this.token = localStorage.getItem('token')
            if (!this.token) {
                this.$nextTick(() => {
                    this.$message({
                        message: '权限不足',
                        type: 'error'
                    })
                    this.$router.go(-1)
                })
                return
            }
            this.loading = true
            this.form.id = this.$page.articles.id
            this.form.id && this.getData()
        },
        methods: {
            async getData () {
              const {data} = await axios.get(`https://api.github.com/gists/${this.form.id}`)
              for (let key in data.files) {
                    this.form['title'] = key
                    this.form['content'] = data.files[key]['content']
                    this.form['description'] = data['description']
                    break
                }
              this.loading = false
            },
            imgAdd(pos, file) {
                // this.$refs.md.$img2Url(pos, file.miniurl)
            },
            onSubmit() {
                if (this.token) {
                    this.publish()
                } else {
                    this.$refs.tokenDialog.open(() => {
                        this.publish()
                    })
                }
            },
            publish() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.submitButton.loading = true
                        this.submitButton.disabled = true
                        // GistApi.edit(this.form).then((response) => {
                        //     let result = response.data
                        //     // console.log(JSON.stringify(result))
                            this.$message({
                                message: '发表成功',
                                type: 'success'
                            })
                            this.$router.push("/article" + result.id)
                        // }).then(() => {
                        //     this.submitButton.loading = false
                        //     this.submitButton.disabled = false
                        // })
                    }
                })
            }
        }
    }
</script>

<style>
</style>