import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
const app = createApp({
    data() {
      return {
        apiUrl:'https://vue3-course-api.hexschool.io/v2',
        apiPath: 'yclu',
        products:[],
        temp:{}
      }
    },
    methods:{
      checkAdmin(){
        axios.post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'index.html';
        })
      },
      getData(){
        axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((response) => {
          const newProducts = response.data.products.map(item=> {
            return {
              ...item,
              shownUrl: item.imageUrl
            }
          });
          this.products = [...newProducts]
        })
        .catch((error) => {
          alert(error.data.message);
        })
      },
      checkItem(item){
        this.temp = item
      },
      mouseEnterImage(image){
        this.temp.shownUrl = image
      },
      mouseOutImage(){
        this.temp.shownUrl = this.temp.imageUrl
      }
    },
    mounted() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;
  
      this.checkAdmin()
    }
  });
  app.mount("#app");