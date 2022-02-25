<template>
  <router-link to="/Cart" class="d-lg-none nav-link position-relative link-secondary" style="cursor: pointer">
    <span class="text-light">Cart</span>
    <i class="bi bi-cart-fill position-absolute top-50 start-50 translate-middle" style="font-size: 2rem"></i>
    <small class="position-absolute top-50 start-50 translate-middle text-white">
      {{ cartData.carts.length }}
    </small>
  </router-link>
  <a class="d-none d-lg-block nav-link position-relative link-secondary" data-bs-toggle="collapse" data-bs-target="#collapseExample" style="cursor: pointer">
    <span class="text-light">Cart</span>
    <i class="bi bi-cart-fill position-absolute top-50 start-50 translate-middle" style="font-size: 2rem"></i>
    <small class="position-absolute top-50 start-50 translate-middle text-white">
      {{ cartData.carts.length }}
    </small>
  </a>
  <div class="collapse position-absolute top-100 end-0 bg-white shadow-sm p-3" id="collapseExample">
    <div class="d-flex justify-content-between">
      <h5>購物車</h5>
      <button type="button" class="btn btn-close" data-bs-toggle="collapse" data-bs-target="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"></button>
    </div>
    <div v-if="cartData.carts.length == 0" class="my-5 text-center">
      <router-link to="/products">
        購物車裡沒有東西！快去逛逛吧！！
      </router-link>
    </div>
    <div v-else>
      <div class="overflow-auto" style="max-height: 50vh">
        <table class="table">
          <tbody>
            <tr v-for="item in cartData.carts" :key="item.id" height="100">
              <td>
                <router-link :to="`/product/${item.product.id}`">
                  <div class="w-100 h-100" ></div>
                  <img :src="item.product.imageUrl" :alt="item.product.title" height="100" >
                </router-link>
              </td>
              <td>
                <div>
                  <h6 class="fw-bold">{{ item.product.title }}</h6>
                  <div>
                    價格：
                    <span v-if="item.product.price===item.product.origin_price">
                      {{ item.price }} 元
                    </span>
                    <span v-else>
                      <small class="text-secondary me-2">
                        <del>{{ item.product.origin_price }} 元</del>
                      </small>
                      <span>{{ item.product.price }} 元</span>
                    </span>
                  </div>
                  <div>
                    價格： <br>
                    <div class="input-group input-group-sm mb-3">
                      <button class="btn btn-secondary" type="button" @click="updateCartItem(item, -1)">-</button>
                      <input type="number"
                              onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                              class="form-control" v-model.number="item.qty"
                              @change="updateCartItem(item, 0)">
                      <button class="btn btn-secondary" type="button" @click="updateCartItem(item, 1)">+</button>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)" :disabled="isLoadingItem===item.id">
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-end mb-3">
        總金額：<span class="text-danger fw-bold">{{ cartData.total }}</span>元
      </div>
      <div class="text-end">
        <router-link to="/cart" class="link-secondary px-2">
          <button class="btn btn-danger">去結帳 <i class="bi bi-arrow-right"></i></button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '@/libs/emitter'

export default {
  name: 'FrontCart',

  data () {
    return {
      cartData: {
        carts: []
      }
    }
  },
  methods: {
    getCart () {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((response) => {
          //   console.log(response);
          this.cartData = response.data.data
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
          alert(response.data.message)
          this.getCart()
          this.isLoadingItem = ''
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    updateCartItem (item, num) {
      if (item.qty + num === 0) {
        this.removeCartItem(item.id)
        return
      }
      if ((item.qty + num) < 1 || item.qty % 1 !== 0) {
        alert('輸入數量錯誤')
        return
      }
      const data = {
        product_id: item.id,
        qty: item.qty + num
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
    }
  },
  mounted () {
    this.getCart()
    emitter.on('get-cart', () => {
      this.getCart()
    })
  }
}
</script>
