<template>
  <q-layout view="hHh LpR lFrs" class="homeBody-template">

    <!-- Header -->
    <q-header class="bg-grey-8 custom-header">
      <q-toolbar class="custom-toolbar">
        <!-- Accessibility and Terminal Buttons -->
        <q-btn flat label="Accessibility" @click.stop="openAccessibilityOptions()" class="btn--no-hover" />
        <q-btn flat label="Terminal" @click.stop="navigateTo('terminal')" class="btn--no-hover" />

        <!-- Title in the middle -->
        <q-toolbar-title>
          <div class="text-h6 text-center">Hacker Portfolio</div>
        </q-toolbar-title>

        <!-- Language Dropdown -->
        <div id="header--language">
          <button id="header__lang" aria-label="Language" class="lang_button" @click="toggleLanguageDropdown()">eng
            &dtrif;</button>
          <div class="header--dropdown" v-show="showLanguageDropdown">
            <ol>
              <li @click="setLanguage('eng')">eng</li>
              <li @click="setLanguage('fre')">fre</li>
              <li @click="setLanguage('ger')">ger</li>
              <li @click="setLanguage('spa')">spa</li>
            </ol>
          </div>
        </div>

        <!-- Network and Shutdown Buttons -->
        <q-btn id="header__network" flat round icon="rss_feed" @click="openNetworkSettings()"
          aria-label="Network"></q-btn>
        <q-btn flat round icon="power_settings_new" @click="shutdown()" />

      </q-toolbar>
    </q-header>

    <!-- Sidebar with Navigation Buttons -->
    <div class="custom-sidebar">
      <div class="sidebar-content">
        <q-btn flat @click="navigateTo('email')" class="btn--no-hover q-ma-sm" size="20px">
          <q-icon name="img:icons/email.png"></q-icon>
        </q-btn>
        <q-btn flat @click="navigateTo('project')" class="btn--no-hover q-ma-sm" size="20px">
          <q-icon name="img:icons/idea.png"></q-icon>
        </q-btn>
        <q-btn flat @click="navigateTo('blog')" class="btn--no-hover q-ma-sm" size="20px">
          <q-icon name="img:icons/blogging.png"></q-icon>
        </q-btn>
        <q-btn flat @click="navigateTo('about')" class="btn--no-hover q-ma-sm" size="20px">
          <q-icon name="img:icons/unknown.png"></q-icon>
        </q-btn>
        <q-btn flat @click="navigateTo('resume')" class="btn--no-hover q-ma-sm" size="20px">
          <q-icon name="img:icons/cv.png"></q-icon>
        </q-btn>
        <q-btn flat @click="navigateTo('home')" class="btn--no-hover q-ma-sm home-btn" size="20px">
          <q-icon name="img:icons/add.png"></q-icon>
        </q-btn>
      </div>
    </div>

    <!-- Browser Section -->
    <q-page-container>
      <div id="desktop" class="desktopClass">
        <!-- Password Prompt Modal/Component -->
        <q-dialog v-model="prompt" persistent>
          <div class="q-pa-md" style="background-color: black; min-width: 350px; max-width: 350px; max-height: 300px;">
            <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md">
              <q-card-section>
                <div class="text-h6" style="color: green">WHAT IS THE PASSWORD</div>
              </q-card-section>

              <q-input ref="passwordRef" filled outlined autofocus standout="bg-teal text-white" label-color="white"
                placeholder-color="white" input-style="color: white;" v-model="password" label="Enter Password *"
                placeholder="flag{xxxxxx}" lazy-rules :rules="nameRules" color="green"
                :type="isPwd ? 'password' : 'text'">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" color="green"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <div>
                <q-btn label="Submit" type="submit" color="green" />
                <q-btn label="Cancel" type="reset" color="green" flat class="q-ml-sm" />
              </div>
            </form>
          </div>
        </q-dialog>

        <div class="icon-container" :style="{ zIndex: iconContainerZIndex }">
          <div class="desktop-align">
            <div class="icon-wrapper" ref="privateIcon" @click.stop="privateSClick" @dblclick.stop="privateDClick"
              :style="{ backgroundColor: privateBackground }">
              <q-icon name="folder" size="5rem" class="folder"></q-icon>
              <q-icon :name="isFolderLocked ? 'lock' : 'lock_open'" size="1.2rem" class="lock-icon"></q-icon>
              <div class="folder-label">PRIVATE</div>
            </div>
            <div class="icon-wrapper" ref="fileIcon" @click.stop="fileSClick" @dblclick="layout = true"
              :style="{ backgroundColor: fileBackground }">
              <q-icon name="description" size="5rem" class="file"></q-icon>
              <div class="file-label">README.txt</div>
              <q-dialog v-model="layout">
                <q-layout view="Lhh lpR fff" container class="bg-white text-dark"
                  style="min-width: 800px; max-width: 800px;">
                  <q-header reveal class="bg-primary">
                    <q-toolbar style="background-color: green;">
                      <q-toolbar-title>Header</q-toolbar-title>
                      <q-btn flat v-close-popup round dense icon="close" />
                    </q-toolbar>
                  </q-header>

                  <q-page-container style="background-color: black; padding: 20px 15px;">
                    <h3 style="text-align: center; color: lightgreen">Welcome to my website!</h3>
                    <q-markdown :src="markdownContent" :no-heading-anchor-links="model" style="color: lightgreen;"></q-markdown>
                  </q-page-container>
                </q-layout>
              </q-dialog>
            </div>
          </div>
        </div>
        
        <router-view id='router' :style="{ zIndex: routerContainerZIndex }"></router-view>
      </div>
    </q-page-container>

  </q-layout>
</template>

<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>

<script>
import HomeLayout from '../js/HomeLayout.js';

export default HomeLayout;
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Ubuntu');
@import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono');

.homeBody-template {
  background: linear-gradient(0deg, rgb(34, 195, 80) 0%, black 100%);
}

.custom-header {
  height: 30px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 1;
}

.custom-toolbar {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.q-btn,
.q-toolbar-title {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  justify-content: center;
  text-align: center;
  align-items: center;
}

:deep(.q-btn.btn--no-hover .q-focus-helper) {
  display: none;
}

#header--language,
.header--dropdown {
  height: 30px;
  justify-content: center;
  text-align: center;
  align-items: center;
}

.lang_button {
  height: 30px;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.custom-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 30px;
  left: 0;
  height: calc(100vh - 30px);
  width: 100px;
  background: rgba(0, 0, 0, 0.55);
  padding: 10px 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  color: white;
}

.q-ma-sm {
  margin: 10px 0;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: none;
}

.home-btn {
  margin-top: auto;
  /* Pushes the home button to the bottom */
}

#desktop {
  margin-left: 100px;
  max-height: calc(100vh - 30px);
  max-width: calc(100vw - 100px);
  overflow: hidden;
  display: block;
  position: absolute;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  box-shadow: none;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
}

.desktop-align {
  width: 8rem;
  height: 7rem;
  display: flex;
  gap: 4rem;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  padding-bottom: 1rem;
}

.icon-wrapper .q-icon {
  flex-grow: 0;
  flex-shrink: 0;
}

.file-label,
.folder-label {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  margin: 0;
  line-height: 1.2;
}

.folder,
.file {
  max-width: 100%;
  max-height: 100%;
  margin-bottom: 0.5rem;
}

.folder {
  color: goldenrod;
  margin-top: 0.7rem;
}

.lock-icon {
  position: relative;
  color: black;
  bottom: 2rem;
  left: 1.5rem;
}

.file {
  color: white;
}

#router {
  pointer-events: none;
}

</style>
