<template>
  <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                    <span>{{ product.title }}</span>
                </h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                        <img class="img-fluid" :src="product.imageUrl" alt="">
                    </div>
                    <div class="col-sm-6">
                        <span class="badge bg-primary rounded-pill">{{ product.category }}</span>
                        <p>商品描述：{{ product.description }}</p>
                        <p>商品內容：{{ product.content }}</p>
                        <div class="h5" v-if="product.price===product.origin_price">{{ product.price }} 元</div>
                        <div v-else>
                            <del class="h6">原價 {{ product.origin_price }} 元</del>
                            <div class="h5">現在只要 {{ product.price }} 元</div>
                        </div>
                        <div>
                            <div class="input-group">
                                <input ref="input" type="number"
                                  class="form-control" v-model.number="qty" min="1" step="1"
                                  onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57">
                                <button type="button" class="btn btn-primary" @click="addToCart">加入購物車</button>
                            </div>
                        </div>
                        <router-link :to="`/product/${product.id}`" @click="closeModal">查看更多細節</router-link>
                    </div>
                    <!-- col-sm-6 end -->
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal' // 不懂

export default {
  name: 'ProductModal',
  props: ['product'],
  data () {
    return {
      modal: {},
      qty: 1
    }
  },
  watch: {
    id () {
      this.getProduct()
    }
  },
  methods: {
    openModal () {
      this.modal.show()
    },
    closeModal () {
      this.modal.hide()
      setTimeout(() => {
        this.qty = 1
      }, 500)
    },
    addToCart () {
      this.$emit('add-to-cart', this.product.id, this.qty)
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal)
  }
}
</script>
