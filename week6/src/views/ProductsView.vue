<template>
  <div class="container py-5">
    <h1 class="text-center">商品</h1>
    <loading :active="isLoading"></loading>
    <!-- 產品Modal -->
    <product-modal :product="product" ref="productModal" @add-to-cart="addToCart"></product-modal>
    <!-- 產品Modal -->
    <div class="row row-cols-2 row-cols-lg-4 g-3 mb-5">
      <div class="col" v-for="product in products" :key="product.id">
        <div class="card h-100">
          <div class="card-img-top" :style="`height:200px; background-image: url(${product.imageUrl}); background-size: cover; background-position:center`"></div>
          <div class="card-body">
            <h5 class="card-title">{{ product.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              <div class="h5" v-if="product.price===product.origin_price">
                  {{ product.origin_price }} 元
              </div>
              <div v-else>
                  <del class="h6">原價 {{ product.origin_price }} 元</del>
                  <div class="h5">現在只要 {{ product.price }} 元</div>
              </div>
            </h6>
            <p class="card-text">{{ product.description }}</p>
          </div>
          <div class="card-footer border-0 bg-white text-center">
            <div class="btn-group btn-group-sm mt-auto">
              <button type="button" class="btn btn-outline-secondary"
                  @click="openProductModal(product)" :disabled="isLoadingItem===product.id">
                  <!-- <i class="fas fa-spinner fa-pulse"></i> -->
                  查看更多
              </button>
              <button type="button" class="btn btn-danger" @click="addToCart(product.id)"
                  :disabled="isLoadingItem===product.id">
                  <span class="spinner-grow spinner-grow-sm"
                      v-show="isLoadingItem===product.id"></span>
                  <!-- <i class="fas fa-spinner fa-pulse"></i> -->
                  加到購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 購物車列表 -->
    <h3 class="text-center">購物車</h3>
    <div v-if="cartData.carts.length == 0" class="my-3 text-center">
      <!-- <a href="#/products">購物車裡沒有東西！快去逛逛吧！！</a> -->
      <p>購物車裡沒有東西！快去逛逛吧！！</p>
    </div>
    <div v-else>
      <div class="text-end">
          <button class="btn btn-outline-danger" type="button" :disabled="cartData.carts.length === 0"
              @click="clearCart">
              清空購物車
          </button>
      </div>
      <table class="table align-middle">
          <thead>
              <tr>
                  <th></th>
                  <th>品名</th>
                  <th style="width: 150px">數量/單位</th>
                  <th>單價</th>
              </tr>
          </thead>
          <tbody>
              <!-- 判斷購物車內是否有資料 -->
              <template v-if="cartData.carts">
                  <tr v-for="item in cartData.carts" :key="item.id">
                      <td>
                          <button type="button" class="btn btn-outline-danger btn-sm"
                              @click="removeCartItem(item.id)" :disabled="isLoadingItem===item.id">
                              <!-- <i class="fas fa-spinner fa-pulse"></i> -->
                              x
                          </button>
                      </td>
                      <td>
                          {{ item.product.title }}
                          <!-- <div class="text-success">
                              已套用優惠券
                          </div> -->
                      </td>
                      <td>
                          <div class="input-group input-group-sm">
                              <div class="input-group mb-3">
                                  <input min="1" step="1" type="number"
                                      onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                                      class="form-control" v-model.number="item.qty"
                                      @change="updateCartItem(item)">
                                  <span class="input-group-text" id="basic-addon2">{{ item.product.unit }}</span>
                              </div>
                          </div>
                      </td>
                      <td class="text-end">
                          <!-- <small class="text-success">折扣價：</small> -->
                          {{ item.total }}
                      </td>
                  </tr>
              </template>
          </tbody>
          <tfoot>
              <tr>
                  <td colspan="3" class="text-end">總計</td>
                  <td class="text-end">{{ cartData.total }}</td>
              </tr>
              <tr>
                  <td colspan="3" class="text-end text-success">折扣價</td>
                  <td class="text-end text-success">{{ }}</td>
              </tr>
          </tfoot>
      </table>
      <div class="text-center">
        <router-link to="/Cart" custom v-slot="{ navigate }">
          <button type="button" class="btn btn-danger mb-5" :disabled="cartData.carts.length === 0" @click="navigate" role="link">去結帳</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ProductModal from '@/components/ProductModalView.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import emitter from '@/libs/emitter'

export default {
  data () {
    return {
      cartData: {
        carts: []
      },
      products: [],
      product: {},
      isLoading: false,
      isLoadingItem: ''
    }
  },
  components: {
    Loading,
    ProductModal
  },
  methods: {
    getProducts () {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`)
        .then((response) => {
          // console.log(response.data)
          this.products = response.data.products
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    openProductModal (product) {
      this.product = product
      this.$refs.productModal.openModal()
    },
    getCart () {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((response) => {
          //   console.log(response);
          this.cartData = response.data.data
          emitter.emit('get-cart')
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    addToCart (id, qty = 1) {
      if (qty < 1 || qty % 1 !== 0) {
        alert('輸入數量錯誤')
        return
      }

      const data = {
        product_id: id,
        qty
      }
      this.isLoadingItem = id
      this.$http
        .post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`, { data })
        .then((response) => {
          // console.log(response)
          this.getCart()
          this.$refs.productModal.closeModal()
          this.isLoadingItem = ''
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    removeCartItem (id) {
      this.isLoadingItem = id
      this.$http
        .delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`)
        .then((response) => {
          // console.log(response);
          alert(response.data.message)
          this.getCart()
          this.isLoadingItem = ''
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    updateCartItem (item) {
      if (item.qty < 1 || item.qty % 1 !== 0) {
        alert('輸入數量錯誤')
        return
      }

      const data = {
        product_id: item.id,
        qty: item.qty
      }
      this.isLoadingItem = item.id
      this.$http
        .put(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`, { data })
        .then((response) => {
          // console.log(response)
          this.getCart()
          this.isLoadingItem = ''
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    clearCart () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)

      this.$http
        .delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`)
        .then(() => {
          alert('已清空購物車')
          this.getCart()
        })
        .catch((error) => {
          console.dir(error)
        })
    }
  },
  mounted () {
    this.getProducts()
    this.getCart()
  }
}

</script>
