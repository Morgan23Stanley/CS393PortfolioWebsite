import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { watch, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic';

export default {
  name: 'AboutPage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const aboutElement = ref(null);
    const aboutContent = ref(null);
    const isDragging = ref(false);
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const startDrag = (e) => {
      if (aboutElement.value.classList.contains('draggable')) {
        // console.log('drag start');
        e.preventDefault();
        isDragging.value = true;
        dragOffsetX = e.clientX - aboutElement.value.getBoundingClientRect().left;
        dragOffsetY = e.clientY - aboutElement.value.getBoundingClientRect().top;
      }
    };

    const doDrag = (e) => {
      if (isDragging.value) {
        // console.log('isdragging');
        const container = document.getElementById('desktop');

        let newX = e.clientX - dragOffsetX - container.getBoundingClientRect().left;
        let newY = e.clientY - dragOffsetY - container.getBoundingClientRect().top + window.scrollY;

        newX = Math.max(0, Math.min(newX, container.offsetWidth - aboutElement.value.offsetWidth));
        newY = Math.max(0, Math.min(newY, container.offsetHeight - aboutElement.value.offsetHeight));

        aboutElement.value.style.left = `${newX}px`;
        aboutElement.value.style.top = `${newY}px`;
      }
    };

    const stopDrag = () => {
      // console.log('drag stopped');
      isDragging.value = false;
    };

    const browserClass = computed(() => {
      loadBrowserState('about');
      return getBrowserState('about');
    });

    const maximize = () => {
      maximizeBrowser('about', $q, aboutContent, aboutElement, isDragging);
    };

    const minimize = () => {
      minimizeBrowser('about', $q, aboutElement);
    };

    watch 

    onMounted(() => {
      console.log(aboutElement.value.className = getBrowserState('about'));
      aboutElement.value.className = getBrowserState('about')
      window.scrollTo(0, getScrollPosition('about'));

      const scrollListener = () => setScrollPosition('about', window.scrollY);
      window.addEventListener('scroll', scrollListener);

      const aboutBar = document.getElementById('browser_toolbar'); // Ensure you have the correct ID for the draggable area
      aboutBar.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);

      nextTick(() => {
        console.log('about next tick');
        if (getBrowserStateStore('about') === 'reduced' && (getDraggableStore('about') === 'true' || getDraggableStore('about') === '')) {
          aboutElement.value.classList.add('draggable');
          saveDraggableStore('about', true);
        }
      });

      onBeforeUnmount(() => {
        window.removeEventListener('scroll', scrollListener);

        const toolbar = aboutElement.value.querySelector('#browser_toolbar');
        if (toolbar) {
          toolbar.removeEventListener('mousedown', startDrag);
        }

        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
      });
    });

    return {
      maximize,
      minimize,
      aboutElement,
      aboutContent,
      browserClass,
      startDrag,
      stopDrag,
    };
  },
};


