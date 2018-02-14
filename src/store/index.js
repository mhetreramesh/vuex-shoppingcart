import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
    state: { //data
        products: [],
        cart: [],
        checkoutStatus: null
    },
    getters: { // computed properties
        availableProducts (state, getters) {
            return state.products.filter(product => product.inventory > 0)
        },
        cartProducts (state, getters) {
            return state.cart.map(cartItem => {
                const product = state.products.find(product => product.id === cartItem.id)
                return {
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity
                }
            })
        },
        cartTotal(state, getters) {
            let total = 0
            getters.cartProducts.forEach(product => {
                total += product.price * product.quantity
            })
            return total
        }
    },
    actions: {
        fetchProducts({commit}) {
            return new Promise((resolve, reject) => {
                shop.getProducts(products => {
                    commit('setProducts', products)
                    resolve()
                })
            })
        },
        addProductToCart({state, commit}, product) {
            if (product.inventory > 0) {
                const cartItem = state.cart.find(item => item.id === product.id)
                if(!cartItem) {
                    commit('pushProductToCart', product.id)
                } else {
                    commit('incrementItemQuantity', cartItem)
                }
                commit('decrementProductInventory', product)
            } else {
                // show out of stock message
            }
        },
        checkout({state, commit}) {
            shop.buyProducts(
                state.cart,
                () => {
                    commit('emptyCart')
                    commit('setCheckoutStatus', 'success')
                },
                () => {
                    commit('setCheckoutStatus', 'success')
                }
            )
        }
    },
    mutations: {
        // set & update state
        setProducts(state, products) {
            state.products = products
        },
        pushProductToCart(state, productId) {
            state.cart.push({
                id: productId,
                quantity: 1
            })
        },
        incrementItemQuantity(state, cartItem) {
            cartItem.quantity++
        },
        decrementProductInventory(state, product) {
            product.inventory--
        },
        emptyCart(state) {
            state.cart = []
        },
        setCheckoutStatus(state, status) {
            state.checkoutStatus = status
        }
    }
})