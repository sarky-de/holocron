import { createApp } from 'vue';
import App from './App.vue';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { createPinia } from 'pinia';

const vuetify = createVuetify({
    components,
    directives,
});

const pinia = createPinia();

const app = createApp(App);
if (process.env.NODE_ENV !== 'production') {
    app.config.devtools = true;
}

app.use(vuetify);
app.use(pinia);

app.mount('#app');
