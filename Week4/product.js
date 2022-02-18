import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
import pagination from './pagination.js';

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yclu";


let productModal = null;
let deleteProductModal = null;

const app = createApp({
  components: {
    pagination
  },
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      pagination: {}
    }
  },
  methods: {
    checkAdmin() {
      axios.post(`${apiUrl}/api/user/check`)
        .then(() => {
          this.getProducts();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'index.html';
        })
    },
    getProducts(page = 1) {
      axios.get(`${apiUrl}/api/${apiPath}/admin/products/?page=${page}`)
        .then((response) => {
          this.products = response.data.products;
          this.pagination = response.data.pagination;
          // console.log(this.products)
          
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

app.component('productModal', {
  props: ['tempProduct'],
  template: `#templateForProductModal`,
  methods: {
    clearRefs() {
      this.$refs.file.value = null;

      if (Array.isArray(this.tempProduct.imagesUrl)) {
        let images = [...document.querySelectorAll('[data-images]')];
        images.forEach(function (item) {
          item.value = null;
        })
      };
    },

    addProduct() {
      axios.post(`${apiUrl}/api/${apiPath}/admin/product`, { data: this.tempProduct })
        .then((response) => {
          // clearRefs();
          document.querySelector('#input-imageUrl').value = null;
          if (Array.isArray(this.tempProduct.imagesUrl)) {
            let images = [...document.querySelectorAll('[data-images]')];
            images.forEach(function (item) {
              item.value = null;
            })
          };

          productModal.hide();
          alert(response.data.message);
          this.$emit('get-products');
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
    editProduct() {
      axios.put(`${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
        .then((response) => {
          // clearRefs();
          document.querySelector('#input-imageUrl').value = null;
          if (Array.isArray(this.tempProduct.imagesUrl)) {
            let images = [...document.querySelectorAll('[data-images]')];
            images.forEach(function (item) {
              item.value = null;
            })
          };

          productModal.hide();
          alert(response.data.message);
          this.$emit('get-products'); // bug: 第二頁商品修改後會回到第一頁
        })
        .catch((error) => {
          alert(error.data.message);
          // console.dir(error)
        })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },

    uploadImage() {
      // console.log(this.$refs.file.files[0])
      const uploadedFile = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      axios.post(`${apiUrl}/api/${apiPath}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          this.tempProduct.imageUrl = response.data.imageUrl;
        })
        .catch((error) => {
          alert(error.data.message);
          // console.dir(error)
        })
    },
    uploadImages(key) {
      const uploadedFile = this.$refs[`file${key}`][0].files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);

      axios.post(`${apiUrl}/api/${apiPath}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          this.tempProduct.imagesUrl[key] = response.data.imageUrl;
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
  }
});

app.component('deleteProductModal', {
  props: ['tempProduct'],
  template: `#templateForDeleteProductModal`,
  methods: {
    deleteProduct() {
      axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`)
        .then((response) => {
          deleteProductModal.hide();
          alert(response.data.message);
          this.$emit('get-products');
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },
  }
});

app.mount("#app");