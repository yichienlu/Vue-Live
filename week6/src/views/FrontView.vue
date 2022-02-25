<template>
  <FrontNavbar />

  <router-view></router-view>

  <div class="d-lg-none position-sticky bottom-0 bg-light">
    <div class="container d-flex justify-content-between">
      <FrontCart/>
      <FrontMember/>
    </div>
  </div>
</template>

<script>
import FrontNavbar from '@/components/FrontNavbar.vue'
import FrontMember from '@/components/FrontMember.vue'
import FrontCart from '@/components/FrontCart.vue'

export default {
  components: {
    FrontNavbar,
    FrontMember,
    FrontCart
  }
}
</script>
