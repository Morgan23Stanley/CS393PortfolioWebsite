import { useQuasar } from 'quasar'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getDraggableStore, saveDraggableStore, loadPrevState, getPrevStateStore, savePrevState, loadBrowserState, getBrowserStateStore, saveBrowserState, setCurrentPage, getCurrentPage, setActiveMiniBrowser, setScrollPosition, getActiveMiniBrowser, getScrollPosition, setBrowserState, getBrowserState, setPrevStates, getPrevStates, minimizeBrowser, maximizeBrowser, closeBrowser } from '../js/pageLogic.js';

export default {
  setup() {
    const $q = useQuasar();
    const password = ref('');
    const passwordRef = ref(null);
    const prompt = ref(false);
    const isFolderLocked = ref(true); // This will be set based on sessionStorage
    const markdownContent = ref('');

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
    onMounted(async () => {
      const response = await fetch('src/markdown/markdown.txt'); // Adjust the path as necessary
      markdownContent.value = await response.text();

    });
    onMounted(() => {
      setCurrentPage('home');
      isFolderLocked.value = sessionStorage.getItem('folderLocked') !== 'false';
    });

    return {
      onSubmit,
      onReset,
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
    navigateTo(pageName) {
      if (getActiveMiniBrowser()) {
        minimizeBrowser(getActiveMiniBrowser(), this.$q)
      }
      setActiveMiniBrowser(pageName);
      this.$router.push({ path: '/' + pageName + 'Browser' });
      nextTick(() => {
        if (getBrowserState(pageName) == 'minimized') {
          loadPrevState(pageName);
        }
        const savedPosition = getScrollPosition(pageName);
        window.scrollTo(0, savedPosition);
      });
    },
  },

};