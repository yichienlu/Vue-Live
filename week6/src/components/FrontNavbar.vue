<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container position-relative justify-content-center align-items-center">
      <router-link to="/" class="navbar-brand">Pet Pet</router-link>
      <button
        class="navbar-toggler position-absolute top-0 end-0 me-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/products" class="nav-link">Products</router-link>
          </li>
          <li class="nav-item me-auto">
            <router-link to="/cart" class="nav-link">Cart</router-link>
          </li>
        </ul>
      </div>
      <div class="d-none d-lg-flex">
        <FrontMember/>
        <FrontCart/>
      </div>
    </div>
  </nav>

</template>

<script>
import FrontMember from '@/components/FrontMember.vue'
import FrontCart from '@/components/FrontCart.vue'

export default {
  name: 'FrontNavbar',
  components: {
    FrontMember,
    FrontCart
  }
}
</script>
