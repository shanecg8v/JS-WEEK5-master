import productModal from './productModal.js';
import zh_TW from './zh_TW.js';

Vue.component('productModal', productModal);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
Vue.component('loading', VueLoading);

VeeValidate.localize('tw', zh_TW);

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
        originalCarts: [],
        carts: [],
        pagination: {},
        user: {
            Pay: "",
            uuid: '7d6af3ec-1d81-48f8-8d68-f01597cd5fd6',
        },
        status: {
            loadingItem: '',
        },
        url: 'https://course-ec-api.hexschool.io/api/',
        isLoading: false
    },
    methods: {
        submitForm() {
            this.isLoading = true;
            let api = `${this.url}${this.user.uuid}/ec/shopping`;
            this.carts.forEach((item, index) => {
                if (item.quantity != this.originalCarts[index].quantity) {

                    let cart = {
                        product: item.product.id,
                        quantity: item.quantity,
                    };
                    axios.patch(api, cart);
                }
            });

            api = `${this.url}${this.user.uuid}/ec/orders`;
            const orders = {
                name: this.user.Name,
                email: this.user.Email,
                tel: this.user.Phone,
                address: this.user.Address,
                payment: this.user.Pay,
                message: this.user.Message,
            }

            axios.post(api, orders).then((res) => {
                console.log(res);
                if (res.data.data.id) {
                    this.isLoading = false;

                    $('#orderModal').modal('show');
                    this.getCart();
                }
            }).catch((err) => {
                this.isLoading = false;
                console.log(err);
                console.dir(err);
                console.log(err.response.data.errors);
            });
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
                this.carts = res.data.data;
                this.originalCarts = JSON.parse(JSON.stringify(this.carts));
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
        },
        removeCart(id) {
            this.isLoading = true;
            let api = '';
            switch (id) {
                case 'all':
                    api = `${this.url}${this.user.uuid}/ec/shopping/all/product`;
                    break;
                default:
                    api = `${this.url}${this.user.uuid}/ec/shopping/${id}`;
                    break;
            }

            axios.delete(api).then(() => {
                this.isLoading = false;
                this.getCarts();
            });
        },
    },
    computed: {
        cartTotal() {
            let total = 0;
            this.carts.forEach((cart) => {
                total += cart.quantity * cart.product.price;
            })
            return total;
        }
    },
    created() {
        this.getProducts();
        this.getCarts();
    },
});