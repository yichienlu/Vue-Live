// import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

// VeeValidation
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email } = VeeValidateRules; // 引入會用到的rule
const { localize, loadLocaleFromURL } = VeeValidateI18n; // 引入多國語言

defineRule("required", required);
defineRule("email", email);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  // 用來做一些設定
  generateMessage: localize("zh_TW"), //啟用 locale
  validateOnInput: true,
});
// VeeValidation ends

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yclu";

// let userProductModal = null;
const app = Vue.createApp({
  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
      productId: "",
      isLoading: false,
      isLoadingItem: "",
      form: {
        user: {
          email: "",
          name: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((response) => {
          // console.log(response.data)
          this.products = response.data.products;
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((response) => {
          //   console.log(response);
          this.cartData = response.data.data;
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    addToCart(id, qty = 1) {
      if(qty < 1 || qty % 1 != 0){
        alert("輸入數量錯誤");
        return
      }

      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then((response) => {
          // console.log(response)
          this.getCart();
          this.$refs.productModal.closeModal();
          this.isLoadingItem = "";
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((response) => {
          // console.log(response);
          alert(response.data.message);
          this.getCart();
          this.isLoadingItem = "";
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    updateCartItem(item) {
      if(item.qty < 1 || item.qty % 1 != 0){
        alert("輸入數量錯誤");
        return
      }

      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then((response) => {
          // console.log(response)
          this.getCart();
          this.isLoadingItem = "";
        })
        .catch((error) => {
          console.dir(error);
        });
    
    },
    clearCart() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then(() => {
          alert("已清空購物車");
          this.getCart();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    createOrder() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

      const order = {
        data: this.form,
      };
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, order)
        .then((response) => {
          // console.log(response.data)
          alert(
            `${response.data.message}：訂單ID為${response.data.orderId}，總金額為${response.data.total}元`
          );
          this.$refs.form.resetForm();
          this.form.message = "";
          this.getCart();
        })
        .catch((error) => {
          console.dir(error);
        });
    },

    isPhone(value){
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '電話格式錯誤'
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.component("product-modal", {
  props: ["id"],
  template: "#userProductModal",
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
      setTimeout(() => {
        this.qty = 1;
      }, 500);
    },
    getProduct() {
      axios
        .get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
        .then((response) => {
          // console.log(response);
          this.product = response.data.product;
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    addToCart() {
      this.$emit("add-to-cart", this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});

// app.use(VueLoading.Plugin);
app.component("Loading", VueLoading.Component);

app.mount("#app");
