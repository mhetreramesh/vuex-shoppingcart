<template>
<div>
    <h1>Product List</h1>
    <img
        v-if="loading"
        src="https://loading.io/spinners/balls/index.circle-slack-loading-icon.gif"
    >
  <ul v-else>
    <li v-for="product in products">
      {{ product.title }} - {{ product.price | currency }} - {{ product.inventory }}
      <button 
        :disabled="!product.inventory > 0"
        @click="addProductToCart(product)">Add to cart </button>
    </li>
  </ul>
  </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },
    computed: {
        products() {
            return this.$store.state.products
        }
    },
    methods: {
        addProductToCart(product) {
            this.$store.dispatch('addProductToCart', product)
        }
    },
    created() {
        this.loading = true
        this.$store.dispatch('fetchProducts')
        .then(() => this.loading = false)
    }
}
</script>