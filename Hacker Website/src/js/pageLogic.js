import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { nextTick } from 'vue';
import { Container } from 'postcss';

const pageStates = reactive({
    currentPage: '',
    activeMiniBrowser: '',
    scrollPositions: {
        about: 0,
        terminal: 0,
    },
    browserStates: {},
    browserContents: {},
    prevStates: {},
});

const setBrowserContents = (pageName, content) => {
    pageStates.browserContents[pageName] = content;
}

const getBrowserContents = (pageName) => {
    return pageStates.browserContents[pageName];
}

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
    setScrollPosition(pageName, getScrollStore(pageName));
};

const getPrevStateStore = (pageName) => {
    localStorage.getItem(pageName + 'PrevState');
}

const savePrevState = (pageName, state) => {
    localStorage.setItem(pageName + 'PrevState', state);
};

const saveScrollStore = (pageName, scrollPos) => {
    localStorage.setItem(pageName + 'Scroll', JSON.stringify(scrollPos));
}

const getScrollStore = (pageName) => {
    return localStorage.getItem(pageName + 'Scroll');
}

const saveDimensionStore = (pageName) => {
    const desktop = document.getElementById('desktop');
    const browser = document.getElementById(pageName);
    if (desktop && browser) {
        const desktopRect = desktop.getBoundingClientRect();
        const browserRect = browser.getBoundingClientRect();

        // Calculate positions relative to the desktop
        const topRelative = browserRect.top - desktopRect.top;
        const leftRelative = browserRect.left - desktopRect.left;
        const rightRelative = browserRect.right - desktopRect.right;
        const bottomRelative = browserRect.bottom - desktopRect.bottom;

        localStorage.setItem(pageName + 'Dimension', JSON.stringify([topRelative, leftRelative, rightRelative, bottomRelative, browserRect.width, browserRect.height]));
    }
}

const getDimensionStore = (pageName) => {
    return JSON.parse(localStorage.getItem(pageName + 'Dimension'));
}

const maximizeBrowser = (pageName, $q, content, element) => {
    const currentState = getBrowserState(pageName);
    var newState;
    var isDraggable;

    if (currentState === 'maximized') {
        if (getDimensionStore(pageName)) {
            var dimension = getDimensionStore(pageName);
            element.value.style.top = dimension[0] + 'px';
            element.value.style.left = dimension[1] + 'px';
        }
        else {
            element.value.style.top = '50px';
            element.value.style.left = '100px';
        }
        newState = 'reduced';
        isDraggable = true;
    } else if (currentState === 'reduced') {
        newState = 'default';
        isDraggable = false;
        element.value.style.left = '0';
        element.value.style.top = '0';
    } else {
        newState = 'maximized';
        isDraggable = false;
    }

    setBrowserState(pageName, newState);
    saveBrowserState(pageName, newState);
    saveDraggableStore(pageName, isDraggable);

    const scrollY = window.scrollY;
    setScrollPosition(pageName, scrollY);
    saveScrollStore(pageName, content.value.scrollTop);

    if (element.value && newState === 'reduced') {
        element.value.className = newState;
        element.value.classList.add('draggable')
    }
    else {
        element.value.className = newState;
    }

    $q.notify({ type: 'info', message: `${pageName} Browser ${newState}` });
};

const minimizeBrowser = (pageName, $q, router) => {
    if (getBrowserState(pageName) === 'reduced') {
        saveDimensionStore(pageName);
    }
    var newState = 'minimized';

    setScrollPosition(pageName, scrollY);
    setBrowserState(pageName, newState);

    if (document.getElementById(pageName)) {
        document.getElementById(pageName).className = newState;
    }

    var currentStorage = getBrowserState(pageName);
    savePrevState(pageName, currentStorage);
    saveBrowserState(pageName, newState);
    setActiveMiniBrowser('');

    setScrollPosition(pageName, getScrollStore(pageName));

    router.push({ path: '/' });
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

const setScrollPosition = (page, scrollPosition) => {
    pageStates.scrollPositions[page] = scrollPosition;
};

const getScrollPosition = (page) => {
    return pageStates.scrollPositions[page];
};

const browserOnMount = (pageName, element, content) => {
    const trySetElementClass = (attemptsLeft) => {
        nextTick(() => {
            var dimension;
            if (getDimensionStore(pageName)) {
                dimension = getDimensionStore(pageName);
            }
            if (element) {
                element.value.className = getBrowserState(pageName);

                if (getBrowserStateStore(pageName) === 'reduced' && (getDraggableStore(pageName) === 'true' || getDraggableStore(pageName) === '')) {
                    element.value.classList.add('draggable');
                    saveDraggableStore(pageName, true);

                    if (dimension) {
                        element.value.style.top = dimension[0] + 'px';
                        element.value.style.left = dimension[1] + 'px';
                    }
                }
                console.log(element.value.style.top, element.value.style.left, element.value.style.width, element.value.style.height);
                // calculateArea(pageName);
                content.value.scrollTo(0, getScrollStore(pageName));
            } else if (attemptsLeft > 0) {
                setTimeout(() => trySetElementClass(attemptsLeft - 1), 100);
                console.log('retrying...' + attemptsLeft)
            } else {
                console.warn(`Element with id '${pageName}' not found after retries.`);
                return false;
            }
        });
    };

    trySetElementClass(3);

    return true;
};

export { browserOnMount, saveDimensionStore, getDimensionStore, setBrowserContents, getBrowserContents, saveScrollStore, getScrollStore, getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser };
