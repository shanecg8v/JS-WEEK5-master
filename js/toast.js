export default {
    template: `
        <div class="toast" style="position: absolute; top: 15px; right: 15px;" data-delay="2500">
            <div class="toast-header">
                <strong class="mr-auto text-danger">選購提醒</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                {{ content[0] }}
            </div>
        </div>`,
    data() {
        return {
            content: [],
        }
    },
    methods: {
        showToast(content) {
            this.content = content;
            $('.toast').toast('show');
        }
    },
}