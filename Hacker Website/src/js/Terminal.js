import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { watch, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic';

export default {
  name: 'TerminalPage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const terminalElement = ref(null);
    const terminalContent = ref(null);

    const loadBrowserState = () => {
      const state = localStorage.getItem('terminalState') || 'default';
      setBrowserState('terminal', state);
    };

    const saveBrowserState = (state) => {
      localStorage.setItem('terminalState', state);
    };

    const browserClass = computed(() => {
      loadBrowserState();
      return getBrowserState('terminal');
    });

    const maximize = () => {
      const currentState = getBrowserState('terminal');
      let newState;
      if (currentState === 'maximized') {
        newState = 'reduced';
      } else if (currentState === 'reduced') {
        newState = 'default';
      } else {
        newState = 'maximized';
      }
      setBrowserState('terminal', newState);
      saveBrowserState(newState);

      if (terminalElement.value) {
        terminalElement.value.className = newState;
      }
    };

    onMounted(() => {
      window.scrollTo(0, getScrollPosition('terminal'));
      
      const scrollListener = () => setScrollPosition('terminal', window.scrollY);
      window.addEventListener('scroll', scrollListener);

      onBeforeUnmount(() => {
        window.removeEventListener('scroll', scrollListener);
      });
    });

    return {
      maximize,
      terminalElement,
      terminalContent,
      browserClass,
    };
  },
};


