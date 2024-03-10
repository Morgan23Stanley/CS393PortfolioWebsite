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
};

const getBrowserState = (page) => {
    return localStorage.getItem(page + 'State') || 'default'; // Retrieve state from localStorage
};

const getDraggableStore = (pageName) => {
    return localStorage.getItem(pageName + 'Draggable');
}

const saveDraggableStore = (pageName, state) => {
    localStorage.setItem(pageName + 'Draggable', JSON.stringify(state));
};

const loadBrowserState = (pageName) => {
    const state = localStorage.getItem(pageName + 'State') || 'default';
    setBrowserState(pageName, state);
};

const getBrowserStateStore = (pageName) => {
    return localStorage.getItem(pageName + 'State');
}

const saveBrowserState = (pageName, state) => {
    localStorage.setItem(pageName + 'State', state);
};

const loadPrevState = (pageName) => {
    const state = localStorage.getItem(pageName + 'PrevState') || 'default';
    setBrowserState(pageName, state);
    saveBrowserState(pageName, state);
    localStorage.removeItem(pageName + 'PrevState');
};

const getPrevStateStore = (pageName) => {
    localStorage.getItem(pageName + 'PrevState');
}

const savePrevState = (pageName, state) => {
    localStorage.setItem(pageName + 'PrevState', state);
};

const maximizeBrowser = (pageName, $q, content, element) => {
    const currentState = getBrowserState(pageName);
    var newState;
    var isDraggable;

    if (currentState === 'maximized') {
        element.value.style.left = '100px';
        element.value.style.top = '50px';
        newState = 'reduced';
        isDraggable = true;
    } else if (currentState === 'reduced') {
        newState = 'default';
        element.value.style.left = '0';
        element.value.style.top = '0';
        isDraggable = false;
    } else {
        newState = 'maximized';
        isDraggable = false;
    }

    setBrowserState(pageName, newState);
    saveBrowserState(pageName, newState);
    saveDraggableStore(pageName, isDraggable);

    if (element.value && newState === 'reduced') {
        element.value.className = newState;
        element.value.classList.add('draggable')
    }
    else {
        element.value.className = newState;
    }

    $q.notify({ type: 'info', message: `${pageName} Browser ${newState}` });
};

const minimizeBrowser = (pageName, $q) => {
    const scrollY = window.scrollY;
    var newState = 'minimized';

    setScrollPosition(pageName, scrollY);
    setBrowserState(pageName, newState);

    if (document.getElementById(pageName )) {
        document.getElementById(pageName ).className = newState;
    }

    var currentStorage = getBrowserState(pageName);
    savePrevState(pageName, currentStorage);
    saveBrowserState(pageName, newState);
    setActiveMiniBrowser('');

    $q.notify({ type: 'info', message: `${pageName} Browser minimized` });
};

const closeBrowser = (pageName, $q) => {
    setBrowserState(pageName, 'closed');
    $q.notify({ type: 'info', message: `${pageName} Browser closed` });
};

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
export { getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser };
