import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
createApp({
    data() {
      return {
        user:{
            username:"",
            password:""
        }
      }
    },
    methods:{
        login() {
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(api, this.user)
                .then((res) => {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken = ${token}; expires=${new Date(expired)}`;
                    alert(res.data.message);
                    window.location = 'product.html';
                })
                .catch((error) => {
                    alert(error.data.message)
                })
        }
    }
  }).mount("#app");