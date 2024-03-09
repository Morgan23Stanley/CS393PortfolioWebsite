import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { nextTick } from 'vue';

const pageStates = reactive({
    currentPage: '',
    activeMiniBrowser: '',
    scrollPositions: {
        about: 0,
        terminal: 0,
    },
    browserStates: {},
    prevStates: {},
});

const setCurrentPage = (pageName) => {
    pageStates.currentPage = pageName;
};

const getCurrentPage = () => {
    return pageStates.currentPage || 'home';
};

const setPrevStates = (page, state) => {
    pageStates.prevStates[page] = state;
};

const getPrevStates = (page) => {
    return pageStates.prevStates[page] || 'default';
};

const setBrowserState = (page, state) => {
    pageStates.browserStates[page] = state;
    localStorage.setItem(page + 'State', state); // Save state to localStorage
};

const getBrowserState = (page) => {
    return localStorage.getItem(page + 'State') || 'default'; // Retrieve state from localStorage
};

const maximizeBrowser = (pageName, $q, route, router, content) => {
    const currentState = getBrowserState(pageName);
    let newState;

    if (currentState === 'maximized') {
        newState = 'reduced';
    } else if (currentState === 'reduced') {
        newState = 'default';
    } else {
        newState = 'maximized';
    }

    setBrowserState(pageName, newState);
    document.getElementById('browser').className = newState;

    setScrollPosition(pageName, content.value?.scrollTop || 0);
    $q.notify({ type: 'info', message: `${pageName} Browser ${newState}` });
};
// Updated functions
const minimizeBrowser = (pageName, $q) => {
    setBrowserState(pageName, 'minimized');
    $q.notify({ type: 'info', message: `${pageName} Browser minimized` });
};
const closeBrowser = (pageName, $q) => {
    setBrowserState(pageName, 'closed');
    $q.notify({ type: 'info', message: `${pageName} Browser closed` });
};

// Function to set the active mini-browser
const setActiveMiniBrowser = (pageName) => {
    pageStates.activeMiniBrowser = pageName;
};

const getActiveMiniBrowser = () => {
    return pageStates.activeMiniBrowser;
};

// Function to update the scroll position of a page
const setScrollPosition = (page, scrollPosition) => {
    pageStates.scrollPositions[page] = scrollPosition;
};

const getScrollPosition = (page) => {
    return pageStates.scrollPositions[page] || 0;
};
export { setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser };
