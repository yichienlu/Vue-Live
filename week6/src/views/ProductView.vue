<template>
  <h3>{{product.title}}</h3>
  <img :src="product.imageUrl" alt="" width="200">
  <router-link to="/products" class="nav-link">回商品列表</router-link>
</template>

<script>
export default {
  data () {
    return {
      product: {}
    }
  },
  mounted () {
    this.$http
      .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${this.$route.params.id}`)
      .then((response) => {
        // console.log(response.data)
        this.product = response.data.product
      })
  }
}
</script>
