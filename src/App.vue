<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useBackButton, useIonRouter } from '@ionic/vue';
import { App } from '@capacitor/app';
import { onMounted } from 'vue';
import { StatusBar } from '@capacitor/status-bar';

const ionRouter = useIonRouter();
useBackButton(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
});

onMounted ( async () => {
  await setStatusBarStyleLight()
})


const setStatusBarStyleLight = async () => {
  await StatusBar.setBackgroundColor({ color: '#0054e9' });
};

</script>
