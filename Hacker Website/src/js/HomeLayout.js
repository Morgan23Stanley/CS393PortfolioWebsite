import { useQuasar } from 'quasar'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { browserOnMount, saveDimensionStore, getDimensionStore, setBrowserContents, getBrowserContents, saveScrollStore, getScrollStore, getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic.js';

export default {
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const password = ref('');
    const passwordRef = ref(null);
    const prompt = ref(false);
    const isFolderLocked = ref(true); // This will be set based on sessionStorage
    const markdownContent = ref('');
    const iconContainerZIndex = ref(1);
    const routerContainerZIndex = ref(2)

    const onSubmit = () => {
      passwordRef.value.validate();

      if (!passwordRef.value.hasError) {
        if (password.value === 'flag{abc123}') {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: 'Gosh darn it! You got the flag!',
          });
          prompt.value = false;
          isFolderLocked.value = false; // Unlock the folder
          sessionStorage.setItem('folderLocked', 'false'); // Save the unlocked state in sessionStorage
          password.value = null;
          passwordRef.value.resetValidation();
        } else {
          $q.notify({
            color: 'negative',
            message: 'Incorrect! Just give up',
          });
          password.value = null;
          passwordRef.value.resetValidation();
        }
      }
    };
    const onReset = () => {
      prompt.value = false;
      password.value = null;
      passwordRef.value.resetValidation();
    };
    const navigateTo = (pageName) => {
      console.log('navigate pressed')
      let sameRoute = true;
      if (route.path.replace('/', '') !== pageName) {
        if (document.getElementById(route.path.replace('/', '')) && getBrowserState(route.path.replace('/', '')) !== 'minimized') {
          console.log('minimize current browser')
          minimizeBrowser(route.path.replace('/', ''), $q, router);
        }
        sameRoute = false;
      }

      router.push({ path: '/' + pageName });
      console.log('router pushed')

      const trySetElementClass = (attemptsLeft) => {
        nextTick(() => {
          const element = document.getElementById(pageName);

          if (element) {
            console.log('element is available')

            if (route.path !== '/') {
              iconContainerZIndex.value = 6;
              routerContainerZIndex.value = 7;
            } else {
              iconContainerZIndex.value = 6;
              routerContainerZIndex.value = 5;
            }

            if (getBrowserState(pageName) == 'minimized') {
              loadPrevState(pageName);
              element.className = getBrowserState(pageName);
              console.log('browser prev state loaded')
            }

            if (getBrowserState(pageName) == 'reduced') {
              element.classList.add('draggable');
              if (getDimensionStore(pageName)) {
                var dimension = getDimensionStore(pageName);
                let element = document.getElementById(pageName);
                element.style.top = dimension[0] + 'px';
                element.style.left = dimension[1] + 'px';
              }
              else {
                element.style.top = '50px';
                element.style.left = '100px';
              }
            }

            if (sameRoute === false) {
              const savedPosition = getScrollStore(pageName);
              document.getElementById(pageName).querySelector('#browser_content').scrollTo(0, savedPosition);
              console.log('browser not same route scroll restored')
            }
          } else if (attemptsLeft > 0) {
            setTimeout(() => trySetElementClass(attemptsLeft - 1), 100);
            console.log('retrying...' + attemptsLeft)
          } else {
            console.warn(`Element with id '${pageName}' not found after retries.`);
          }
        });
      };

      trySetElementClass(3);
    };
    // watch(() => route.path, (newPath) => {
    //   nextTick(() => {
    //     const segments = newPath.split('/');
    //     const pageName = segments.pop() || segments.pop();

    //     const element = document.getElementById(pageName);

    //     if (element) {
    //       element.className = getBrowserState(pageName);
    //       const savedPosition = getScrollStore(pageName);
    //       window.scrollTo(0, savedPosition);
    //     } else {
    //       console.warn(`Element with ID ${pageName} not found after route change to ${newPath}`);
    //     }
    //   });
    // });
    // watch(() => route.path, () => {
    //   console.log(route.path);
    //   if (route.path !== '/') {
    //     iconContainerZIndex.value = 6;
    //     routerContainerZIndex.value = 7;
    //   } else {
    //     iconContainerZIndex.value = 6; 
    //     routerContainerZIndex.value = 5;
    //   }
    // });
    onMounted(async () => {
      const response = await fetch('src/markdown/markdown.txt'); // Adjust the path as necessary
      markdownContent.value = await response.text();
    });
    onMounted(() => {
      console.log('homelayout loaded or refreshed')
      isFolderLocked.value = sessionStorage.getItem('folderLocked') !== 'false';

      if (!sessionStorage.getItem('sessionID')) {
        sessionStorage.setItem('sessionID', "id" + Math.random().toString(16).slice(2))
        console.log('sessionId created')
      }

      const trySetElementClass = (attemptsLeft) => {
        nextTick(() => {
          const savedPosition = getScrollStore(route.path.replace('/', ''));
          if (route.path.replace('/', '') !== '') {
            var content = document.getElementById(route.path.replace('/', '')).querySelector('#browser_content');
          }

          if (content) {
            content.scrollTo(0, savedPosition);
            console.log('browser content scroll restored')
          } else if (attemptsLeft > 0) {
            setTimeout(() => trySetElementClass(attemptsLeft - 1), 100);
            console.log('retrying...' + attemptsLeft)
          } else {
            console.warn(`Element with id '${route.path.replace('/', '')}' not found after retries.`);
          }
        });
      };

      trySetElementClass(3);

      onBeforeUnmount(() => {
        const browserContent = document.getElementById(route.path.replace('/', '')).querySelector('#browser_content');

        if (browserContent) {
          saveScrollStore(route.path.replace('/', ''), browserContent.scrollTop);
          console.log('browser content scroll saved')
        }
      });
    });

    return {
      onSubmit,
      onReset,
      navigateTo,
      prompt,
      password,
      passwordRef,
      isFolderLocked,
      nameRules: [
        val => (val && val.length > 0) || 'Please enter the password',
      ],
      privateBackground: ref('transparent'),
      fileBackground: ref('transparent'),
      isPwd: ref(true),
      layout: ref(false),
      markdownContent,
      iconContainerZIndex,
      routerContainerZIndex,
    };
  },
  data() {
    return {
      model: true,
    }
  },
  components: {
    QMarkdown
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnMount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  computed: {
  },
  methods: {
    fileSClick() {
      this.fileBackground = 'rgba(173, 216, 230, 0.5)';
      this.privateBackground = 'transparent';
    },
    privateSClick() {
      this.privateBackground = 'rgba(173, 216, 230, 0.5)';
      this.fileBackground = 'transparent';
    },
    privateDClick() {
      if (this.isFolderLocked) {
        this.prompt = true;
      }
    },
    handleOutsideClick(event) {
      const fileIcon = this.$refs.fileIcon;
      const privateIcon = this.$refs.privateIcon;

      if (fileIcon && !fileIcon.contains(event.target)) {
        this.fileBackground = 'transparent';
      }

      if (privateIcon && !privateIcon.contains(event.target)) {
        this.privateBackground = 'transparent';
      }
    },
  },
};