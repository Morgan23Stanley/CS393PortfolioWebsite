import { onMounted, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
import { setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic';

export default {
  name: 'AboutPage',
  setup() {
    const $q = useQuasar();

    // Wrap the imported functions to use them in the template
    const minimize = () => minimizeBrowser('about', $q);
    const maximize = () => maximizeBrowser('about', $q);
    const close = () => closeBrowser('about', $q);

    onMounted(() => {
      window.scrollTo(0, getScrollPosition('about'));
      const scrollListener = () => setScrollPosition('about', window.scrollY);
      window.addEventListener('scroll', scrollListener);

      onBeforeUnmount(() => {
        window.removeEventListener('scroll', scrollListener);
      });
    });

    return {
      minimize,
      maximize,
      close,
    };
  },
};