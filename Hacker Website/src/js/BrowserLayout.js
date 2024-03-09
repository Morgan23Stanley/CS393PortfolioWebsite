import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import { setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState } from '../js/pageLogic';

export default {
    props: ['pageName'], // Ensure you pass the pageName as a prop

    setup(props) {
        const browserState = ref(getBrowserState(props.pageName)); // Get the initial state
        const $q = useQuasar();

        const minimizeBrowser = () => {
            const browserContent = document.getElementById('browser_content');
            const browserElement = document.getElementById('browser');

            setBrowserState(props.pageName, 'minimized');
            browserState.value = 'minimized';

            if (browserElement) {
                browserElement.className = '';
                browserElement.classList.add('minimized');
            }

            setScrollPosition(getActiveMiniBrowser(), browser_content.scrollTop);
            $q.notify({ type: 'info', message: getActiveMiniBrowser() + ' Browser ' + browserState.value });
            // Additional logic for minimizing
        };

        const maximizeBrowser = () => {
            setBrowserState(props.pageName, 'maximized');
            browserState.value = 'maximized';
            $q.notify({ type: 'info', message: getActiveMiniBrowser() + ' Browser ' + browserState.value });
            // Additional logic for maximizing
        };

        const closeBrowser = () => {
            setBrowserState(props.pageName, 'closed');
            browserState.value = 'closed';
            $q.notify({ type: 'info', message: getActiveMiniBrowser() + ' Browser ' + browserState.value });
            // Additional logic for closing
        };

        return {
            minimizeBrowser,
            maximizeBrowser,
            closeBrowser,
        };
    }
};