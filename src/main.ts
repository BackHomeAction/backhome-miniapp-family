import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { internalMixin } from "./utils/runtime";
import tim from "./utils/tim";

const app = createApp(App);
app.config.globalProperties.$tim = tim;

internalMixin(app);

app.use(store).mount("#app");
