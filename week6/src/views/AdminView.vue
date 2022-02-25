<template>
  <router-link to="/admin/dashboard">Dashboard</router-link> |
  <router-link to="/admin/products">Admin Products</router-link> |
  <router-link to="/admin/Orders">Orders</router-link> |
  <router-link to="/admin/Coupon">Coupon</router-link> |
  <router-link to="/admin/goodStuff">(✧≖‿ゝ≖)</router-link> |
  <router-link to="/" class="link-dark">回前台</router-link>
  <router-view v-if="checkSuccess"></router-view>
</template>

<script>
// 驗證
export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  methods: {
    checkAdmin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
      if (token) {
        this.$http.defaults.headers.common.Authorization = token

        this.$http.post(`${process.env.VUE_APP_API}/api/user/check`)
          .then(() => {
            this.checkSuccess = true
          })
          .catch((error) => {
            console.dir(error)
            alert(error.response.data.message)
            this.$router.push('/login')
          }
          )
      } else {
        alert('您尚未登入')
        this.$router.push('/login')
      }
    }
  },
  mounted () {
    this.checkAdmin()
  }
}
</script>
