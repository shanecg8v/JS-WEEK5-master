export default {
  template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">{{ tempProduct.title }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img :src="tempProduct.imageUrl[0]" class="figure-img img-fluid">
          <blockquote class="blockquote">
            <p class="mb-0">{{ tempProduct.content }}</p>
            <footer class="blockquote-footer text-right">{{ tempProduct.description }}</cite></footer>
          </blockquote>
          <div class="d-flex justify-content-between" v-if="tempProduct.origin_price != tempProduct.price">
            <del class="h6">原價{{ tempProduct.origin_price }}元</del>
            <h5>現在只要{{ tempProduct.price }}元</h5>
          </div>
          <div class="d-flex justify-content-end" v-else>
              <h5>原價{{ tempProduct.price }}元</h5>
          </div>
          <select v-model="tempProduct.num" class="form-control mt-1">
            <option value="0" disabled selected>請選擇購買數量</option>
            <option v-for="num in 10" :value="num" :key="num">選購 {{ num }} {{ tempProduct.unit }}</option>
          </select>
        </div>
        <div class="modal-footer">
          <div class="text-muted text-nowrap mr-3">小計 <span>{{ tempProduct.num * tempProduct.price }}</span> 元</div>
          <button type="button" class="btn btn-primary" @click="addToCart" :disabled="status.isLoading || tempProduct.num === 0">
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"
                v-if="status.isLoading"></span>
            <span class="sr-only">Loading...</span>
            加到購物車</button>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      tempProduct: {
        imageUrl: [],
        num: 0,
      },
      status: {
        isLoading: false
      }
    }
  },
  props: ['user', 'url'],
  methods: {
    getProduct(id) {
      const api = `${this.url}${this.user.uuid}/ec/product/${id}`;
      axios.get(api).then(res => {
        this.tempProduct = res.data.data;
        this.$set(this.tempProduct, 'num', 0);
        this.$emit('send-status');
        $('#productModal').modal('show');
      });
    },
    addToCart() {
      this.status.isLoading = true;
      const api = `${this.url}${this.user.uuid}/ec/shopping`;
      const cart = {
        product: this.tempProduct.id,
        quantity: this.tempProduct.num,
      };
      axios.post(api, cart).then(() => {
        this.status.isLoading = false;
        this.$emit('get-cart');
        $('#productModal').modal('hide');
      });
    }
  }
}