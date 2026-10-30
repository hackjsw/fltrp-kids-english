import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Welcome from './views/Welcome.vue'
import Map from './views/Map.vue'
import Unit from './views/Unit.vue'
import Cards from './views/Cards.vue'
import ListenPick from './views/ListenPick.vue'
import Repeat from './views/Repeat.vue'
import Bubbles from './views/Bubbles.vue'
import Feed from './views/Feed.vue'
import Train from './views/Train.vue'
import Voice from './views/Voice.vue'
import Stickers from './views/Stickers.vue'
import Shop from './views/Shop.vue'
import Me from './views/Me.vue'
import '@fontsource-variable/nunito'
import './style.css'
import './games.css'
import './ui.css'
import './journal.css'

const GAME_VIEWS = { cards: Cards, listen: ListenPick, repeat: Repeat, bubbles: Bubbles, feed: Feed, train: Train, voice: Voice }

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Welcome },
    { path: '/map', component: Map },
    { path: '/stickers', component: Stickers },
    { path: '/shop', component: Shop },
    { path: '/me', component: Me },
    { path: '/u/:module/:unit', component: Unit, props: true },
    ...Object.entries(GAME_VIEWS).map(([id, component]) => ({
      path: `/u/:module/:unit/${id}`,
      component,
      props: true,
    })),
  ],
  scrollBehavior: () => ({ top: 0 }),
})

createApp(App).use(router).mount('#app')
