import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { watch, nextTick, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { setBrowserContents, getBrowserContents, saveScrollStore, getScrollStore, getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic';

export default {
  name: 'TerminalPage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const terminalElement = ref(null);
    const terminalContent = ref(null);
    const isDragging = ref(false);
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const startDrag = (e) => {
      if (terminalElement.value.classList.contains('draggable')) {
        // console.log('drag start');
        e.preventDefault();
        isDragging.value = true;
        dragOffsetX = e.clientX - terminalElement.value.getBoundingClientRect().left;
        dragOffsetY = e.clientY - terminalElement.value.getBoundingClientRect().top;
      }
    };

    const doDrag = (e) => {
      if (isDragging.value) {
        // console.log('isdragging');
        const container = document.getElementById('desktop');

        let newX = e.clientX - dragOffsetX - container.getBoundingClientRect().left;
        let newY = e.clientY - dragOffsetY - container.getBoundingClientRect().top + window.scrollY;

        newX = Math.max(0, Math.min(newX, container.offsetWidth - terminalElement.value.offsetWidth));
        newY = Math.max(0, Math.min(newY, container.offsetHeight - terminalElement.value.offsetHeight));

        terminalElement.value.style.left = `${newX}px`;
        terminalElement.value.style.top = `${newY}px`;
      }
    };

    const stopDrag = () => {
      // console.log('drag stopped');
      isDragging.value = false;
    };

    const browserClass = computed(() => {
      loadBrowserState('terminal');
      return getBrowserState('terminal');
    });

    const maximize = () => {
      maximizeBrowser('terminal', $q, terminalContent, terminalElement, isDragging);
    };

    const minimize = () => {
      minimizeBrowser('terminal', $q, router);
    };

    onMounted(() => {
      terminalElement.value.className = getBrowserState('terminal');

      const scrollListener = () => {
        setScrollPosition('terminal', terminalContent.value.scrollTop);
        saveScrollStore('terminal', terminalContent.value.scrollTop)
      }
      terminalContent.value.addEventListener('scroll', scrollListener);

      const terminalBar = document.getElementById('browser_toolbar'); // Ensure you have the correct ID for the draggable area
      terminalBar.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);

      nextTick(() => {
        console.log('terminal next tick');
        if (getBrowserStateStore('terminal') === 'reduced' && (getDraggableStore('terminal') === 'true' || getDraggableStore('terminal') === '')) {
          terminalElement.value.classList.add('draggable');
          saveDraggableStore('terminal', true);
        }
        terminalContent.value.scrollTo(0, getScrollStore('terminal'));
      });

      onBeforeUnmount(() => {
        terminalContent.value.removeEventListener('scroll', scrollListener);

        const toolbar = terminalElement.value.querySelector('#browser_toolbar');
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
      terminalElement,
      terminalContent,
      browserClass,
      startDrag,
      stopDrag,
    };
  },
};


