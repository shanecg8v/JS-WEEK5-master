import productModal from './productModal.js';

Vue.component('productModal', productModal);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
Vue.component('loading', VueLoading);

VeeValidate.configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid'
    }
})

new Vue({
    el: '#app',
    data: {
        products: [],
        tempProduct: {
            imageUrl: []
        },
        pagination: {},
        user: {
            uuid: '7d6af3ec-1d81-48f8-8d68-f01597cd5fd6'
        },
        status: {
            loadingItem: '',
        },
        url: 'https://course-ec-api.hexschool.io/api/',
        isLoading: false
    },
    methods: {
        submitForm() {

        },
        getProducts(num = 1) {
            this.isLoading = true;
            const api = `${this.url}${this.user.uuid}/ec/products?page=${num}`;

            axios.get(api).then(res => {
                this.isLoading = false;
                this.products = res.data.data;
                this.pagination = res.data.meta.pagination;
            });
        },
        showProduct(id) {
            this.status.loadingItem = id;
            this.$refs.productModal.getProduct(id);
        },
        changeStatus() {
            this.status.loadingItem = '';
        },
        getCarts() {
            this.isLoading = true;
            const api = `${this.url}${this.user.uuid}/ec/shopping`;

            axios.get(api).then((res) => {
                this.isLoading = false;
                console.log(res);
            });
        },
        addToCart(id) {
            this.status.loadingItem = id;
            const api = `${this.url}${this.user.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity: 1,
            };
            axios.post(api, cart).then(() => {
                this.status.loadingItem = '';
                this.getCarts();
            });
        }
    },
    created() {
        this.getProducts();
        this.getCarts();
    }
});