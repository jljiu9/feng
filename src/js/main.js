import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'plyr/dist/plyr.css'

// import "heyui/themes/index.less";
// import heyui from 'heyui';
// import "lew-ui/dist/style.css"
// import Lew from "lew-ui"
// import { createStore } from 'vuex'

import App from '../App.vue'
import {router} from './router'


createApp(App).use(router).use(ElementPlus)
// .use(heyui)
.mount('#app')
