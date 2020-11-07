<template>
    <div>
        <el-dialog title="绑定Token" :visible.sync="show" width="500px">
            <el-form :model="tokenForm" ref="tokenForm" label-width="100px">
                <el-form-item label="GitHub">
                    <el-tag>{{githubUsername}}</el-tag>
                </el-form-item>
                <el-form-item prop="token" label="Token" :rules="[{ required: true, message: '请输入accessToken', trigger: 'blur' }]">
                    <el-input v-model="tokenForm.token" placeholder="请保管好Token"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import configuration from '../../../static/configuration.json'
    import events from '../../common/events'

    export default {
        // props: {
        //     refreshToken
        // },
        data() {
            return {
                githubUsername: configuration.githubUsername,
                show: false,
                handleClose: null,
                tokenForm: {
                    token: ""
                }
            }
        },
        methods: {
            open(handleClose) {
                this.handleClose = handleClose
                this.show = true
            },
            onSubmit() {
                let username = this.githubUsername
                this.$refs["tokenForm"].validate(async (valid) => {
                    if (valid) {
                        try {
                            const res = await axios.get(`https://api.github.com/user?access_token=${this.tokenForm.token}`)
                            let result = res.data
                            if (username == result['login']) {
                                localStorage.setItem('token', this.tokenForm.token)
                                events.$emit('refreshToken')
                                this.$notify({
                                    title: '成功',
                                    message: 'Token绑定成功',
                                    type: 'success'
                                })
                            }
                        } catch (e) {
                            this.$message({
                                message: 'Token用户不一致',
                                type: 'error'
                            })
                        }
                        if (typeof this.handleClose == "function") {
                            this.handleClose()
                        }
                    }
                })
                this.show = false
            }
        }
    }
</script>