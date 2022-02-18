import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

let productModal = null;
let deleteProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'yclu',
      products: [],
      tempProduct: {
        imagesUrl: [],
      }
    }
  },
  methods: {
    checkAdmin() {
      axios.post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'index.html';
        })
    },
    getData() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((response) => {
          this.products = response.data.products
          console.log(response)
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
    addProduct(){
      axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, {data: this.tempProduct})
      .then((response) => {
        productModal.hide();
        alert(response.data.message);
        this.getData();
      })
      .catch((error) => {
        alert(error.data.message);
      })
    },
    editProduct(){
      axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`, {data: this.tempProduct})
      .then((response) =>{
        productModal.hide();
        alert(response.data.message);
        this.getData();
      })
      .catch((error) => {
        alert(error.data.message);
      })
    },
    deleteProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
        .then((response) => {
          deleteProductModal.hide();
          alert(response.data.message);
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },

  },
  mounted() {
    // modal DOM
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
      keyboard: false
    });

    // token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin()
  }
});
app.mount("#app");