import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'plyr/dist/plyr.css'

// import "lew-ui/dist/style.css"

// import "heyui/themes/index.less";
// import heyui from 'heyui';
// import Lew from "lew-ui"

import App from '../App.vue'
import {router} from './router'
// import { createStore } from 'vuex'

createApp(App).use(router).use(ElementPlus)
// .use(heyui)
.mount('#app')
