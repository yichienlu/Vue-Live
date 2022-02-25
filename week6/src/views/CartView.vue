<template>
  <div class="container py-5">
    <loading :active="isLoading"></loading>
    <h1 class="text-center">購物車</h1>
    <div v-if="cartData.carts.length == 0" class="my-5 text-center">
      <router-link to="/products">
        購物車裡沒有東西！快去逛逛吧！！
      </router-link>
    </div>
    <table class="table align-middle" v-else>
      <thead>
        <tr>
          <th>品名</th>
          <th class="text-center">單價</th>
          <th style="width: 150px">數量</th>
          <th class="text-end">合計</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartData.carts" :key="item.id">
          <td>
            <router-link :to="`/product/${item.product.id}`" class="link-dark text-decoration-none d-flex align-items-center">
              <img :src="item.product.imageUrl" :alt="item.product.title" height="100" class="mx-3">
              <div>
                <h5>{{ item.product.title }}</h5>
                <p>{{ item.product.description }}</p>
              <!-- <div class="text-success">
                已套用優惠券
              </div> -->
              </div>
            </router-link>
          </td>
          <td class="text-center">
            <div v-if="item.product.price===item.product.origin_price">
              {{ item.price }} 元
            </div>
            <div v-else>
              <small>
                <del>{{ item.product.origin_price }} 元</del>
              </small>
              <div>{{ item.product.price }} 元</div>
            </div>
          </td>
          <td>
            <div class="input-group mb-3">
              <button class="btn btn-secondary" type="button" @click="updateCartItem(item, -1)">-</button>
              <input type="number"
                      onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                      class="form-control" v-model.number="item.qty"
                      @change="updateCartItem(item, 0)">
              <button class="btn btn-secondary" type="button" @click="updateCartItem(item, 1)">+</button>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm"
              @click="removeCartItem(item.id)" :disabled="isLoadingItem===item.id">
              刪除
            </button>
          </td>
          <td class="text-end">
            <!-- <small class="text-success">折扣價：</small> -->
            {{ item.total }}
          </td>
        </tr>
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

    <!-- 表單 -->
    <div class="my-5">
      <h3 class="text-center mb-3">訂購人資訊</h3>
      <div class="row justify-content-center">
        <form-component ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <field-component id="email" name="email" type="email" class="form-control" rules="email|required"
                  :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email"
                  v-model="form.user.email"></field-component>
            <error-message name="email" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <field-component id="name" name="姓名" type="text" class="form-control"
                    :class="{ 'is-invalid': errors['姓名'] }" placeholder="請輸入姓名" rules="required"
                    v-model="form.user.name"></field-component>
            <error-message name="姓名" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <field-component id="tel" name="電話" type="tel" class="form-control"
                    :class="{ 'is-invalid': errors['電話'] }" placeholder="請輸入電話" :rules="isPhone"
                    v-model="form.user.tel"></field-component>
            <error-message name="電話" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <field-component id="address" name="地址" type="text" class="form-control"
                    :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入地址" rules="required"
                    v-model="form.user.address"></field-component>
            <error-message name="地址" class="invalid-feedback"></error-message>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea id="message" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
          </div>
          <div class="text-end">
            <button type="submit" class="btn btn-danger"
                    :disabled="Object.keys(errors).length > 0 || cartData.carts.length === 0">
                    送出訂單
            </button>
          </div>
        </form-component>
      </div>
    </div>
  </div>
</template>

<script>
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
      isLoadingItem: '',
      form: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  components: {
    Loading
  },
  methods: {
    getCart () {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((response) => {
          // console.log(response)
          this.cartData = response.data.data
          emitter.emit('get-cart')
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
          alert(response.data.message)
          this.getCart()
          this.isLoadingItem = ''
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    createOrder () {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)

      const order = {
        data: this.form
      }
      this.$http
        .post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`, order)
        .then((response) => {
          // console.log(response.data)
          alert(
            `${response.data.message}：訂單ID為${response.data.orderId}，總金額為${response.data.total}元`
          )
          this.$refs.form.resetForm()
          this.form.message = ''
          this.getCart()
        })
        .catch((error) => {
          console.dir(error)
        })
    },

    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '電話格式錯誤'
    }
  },
  mounted () {
    this.getCart()
  }
}
</script>
