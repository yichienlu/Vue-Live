<template>
  <div class="d-flex align-items-center">
    <div class="d-flex" v-if="loggedIn">
      <div class="nav-item" v-if="checkSuccess">
        <router-link to="/admin" class="nav-link link-secondary">後台</router-link>
      </div>
      <div class="nav-item">
        <a href="#" class="nav-link link-secondary" @click.prevent="logOut">登出</a>
      </div>
    </div>
    <div class="nav-item border-danger" v-else>
      <router-link to="/Login" class="nav-link link-secondary">登入</router-link>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loggedIn: false,
      checkSuccess: false
    }
  },
  methods: {
    checkAdmin () {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1'
      )
      if (token) {
        this.$http.defaults.headers.common.Authorization = token
        this.$http
          .post(`${process.env.VUE_APP_API}/api/user/check`)
          .then(() => {
            // console.log('已登入')
            this.loggedIn = true
          })
          .catch((error) => {
            console.dir(error)
          })
      }
      //  知道這個做法不對，但是想要模擬登入後，顧客和管理員有不同權限的情況
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products`
        )
        .then(() => {
          // console.log('有後台權限')
          this.checkSuccess = true
          // console.log(this.loggedIn, this.checkSuccess)
        })
        .catch((error) => {
          console.dir(error)
        })
    },
    logOut () {
      document.cookie = 'hexToken=;expires=;'
      alert('已登出')
      this.loggedIn = false
      this.checkSuccess = false

      // this.$http.post(`${process.env.VUE_APP_API}/logout`)
      //   .then((res) => {
      //     alert(res.data.message)
      //     this.loggedIn = false
      //     this.checkAdmin()
      //     this.getCart()
      //   })
      //   .catch((error) => {
      //     // alert(error.data.message)
      //     console.dir(error)
      //   })
    }
  },
  mounted () {
    this.checkAdmin()
  }
}
</script>
