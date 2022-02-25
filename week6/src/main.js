import { createApp } from 'vue'
import 'bootstrap'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate' // 匯入 vee-validate 主套件
import { required, email, min } from '@vee-validate/rules' // 匯入 vee-validate 相關規則
import { localize, setLocale } from '@vee-validate/i18n' // 匯入多國語系的功能
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json' // 匯入繁體中文語系檔案

import App from './App.vue'
import router from './router'

// 定義驗證規則
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
// 設定預設語系
setLocale('zh_TW')

const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
// app.use(VueLoading)

// 註冊 vee-validate 三個全域元件
app.component('FormComponent', Form)
app.component('FieldComponent', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
