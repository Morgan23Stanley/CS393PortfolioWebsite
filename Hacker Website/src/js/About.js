import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { watch, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { browserOnMount, saveDimensionStore, getDimensionStore, setBrowserContents, getBrowserContents, saveScrollStore, getScrollStore, getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic';

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

        saveDimensionStore('about');
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
      minimizeBrowser('about', $q, router);
    };

    onMounted(() => {
      var done = browserOnMount('about', aboutElement, aboutContent, startDrag, doDrag, stopDrag);

      let scrollListener = null;
      let cleanupResize = null;
      if (done) {
        scrollListener = () => {
          setScrollPosition('about', aboutContent.value.scrollTop);
          saveScrollStore('about', aboutContent.value.scrollTop)
        }
        aboutContent.value.addEventListener('scroll', scrollListener);

        const aboutBar = document.getElementById('browser_toolbar'); // Ensure you have the correct ID for the draggable area
        aboutBar.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
      }
      onBeforeUnmount(() => {
        aboutContent.value.removeEventListener('scroll', scrollListener);
  
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


