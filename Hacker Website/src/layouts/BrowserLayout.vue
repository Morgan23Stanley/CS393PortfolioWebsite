<template>
  <q-page class="flex flex-center">
    <div id="browser" class="default">
      <!-- Browser Toolbar -->
      <section id="browser_toolbar">
        <div id="bar__buttons">
          <button class="bar__button close" id="browser-close" @click.stop="closeBrowser">&#10005;</button>
          <button class="bar__button" id="browser-minimize" @click.stop="minimizeBrowser">&#9472;</button>
          <button class="bar__button" id="browser-maximize" @click.stop="maximizeBrowser">&#9723;</button>
        </div>
      </section>
      <!-- Browser Content -->
      <section id="browser_content">
        <router-view />
      </section>
    </div>
  </q-page>
</template>

<script>
import BrowserLayout from '../js/BrowserLayout.js';

export default BrowserLayout;
</script>

<style scoped>
#browser.default {
  overflow: hidden;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: none;
}

#browser.reduced {
  display: block;
  position: absolute;
  height: 400px;
  width: 600px;
  top: 50px;
  left: 100px;
  margin: 0;
  cursor: grab;
}

#browser.minimized {
  display: none;
}

#browser_toolbar:active {
  cursor: grabbing;
}

#browser_toolbar {
  min-height: 30px;
  max-height: 30px;
  cursor: default;
  display: flex;
  width: 100%;
  height: 30px;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  background: linear-gradient(#504b45 0%, #3c3b37 100%);
  z-index: inherit;
  align-items: center;
  text-align: center;
  justify-items: center;
}

#bar__buttons {
  display: flex;
  align-items: center;
}

.bar__button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-right: 5px;
  font-size: 8px;
  height: 12px;
  width: 12px;
  box-sizing: border-box;
  border: none;
  border-radius: 100%;
  background: linear-gradient(#7d7871 0%, #595953 100%);
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 1px 0px #41403A, 0px 1px 1px 0px #474642;
}

.bar__button:hover {
  cursor: pointer;
}

.bar__button:focus {
  outline: none;
}

.close {
  background: linear-gradient(#f37458 0%, #de4c12 100%);
  background-clip: padding-box;
}

#browser_content {
  background: rgba(56, 4, 40);
  opacity: 100%;
  font-family: 'Ubuntu Mono';
  height: 100%;
  overflow: auto;
}
</style>