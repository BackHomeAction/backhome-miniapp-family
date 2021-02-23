<script lang="ts">
import { defineComponent } from "vue";
import authService from "./service/authService";
import { getToken } from "./utils/auth";

export default defineComponent({
  onLaunch() {
    console.log("App Launch");
    if (getToken()) {
      authService.login();
    }
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>
<style lang="scss">
@import "./styles/iconfont.scss";
@import "./styles/common.scss";

page {
  background-color: $uni-bg-color;
}
</style>
