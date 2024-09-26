<script setup>
import { ref, onMounted } from 'vue'
import { IonIcon } from '@ionic/vue';
import { useSpeechRecognition } from '@vueuse/core'
import { useUserMedia } from '@vueuse/core'
import { AVMedia } from 'vue-audio-visual';
import { mic } from 'ionicons/icons';
const { stream, enabled  } = useUserMedia({
  constraints: { audio:true },
})

const showBar = ref(false)


const natija = ref('')
    const { isSupported, isListening, isFinal, result, start, stop } = useSpeechRecognition({
      lang: 'en-US',
      interimResults: true,
      continuous: true,
    })
  

    const toggleListening = () => {
      natija.value = ''
      if (!isListening.value) {
        enabled.value = true
        showBar.value = true
        start()
      } else {
        stop()
        enabled.value = false
        showBar.value = false
        natija.value = result.value
      }
    }

   
 


</script>
<template>

    <p class="p-5">{{ natija }}</p>
        <div class="flex items-center justify-center py-5">
          <button @click="toggleListening" class="shadow-none bg-emerald-400 rounded-full w-[60px] h-[60px] flex justify-center items-center relative overflow-hidden">
             <div class="pulse"></div>
             <ion-icon v-show="!showBar" :icon="mic" class="text-3xl text-white"></ion-icon>
           <div v-show="showBar">
            <AVMedia :media="stream" type="frequ" :frequ-lnum="3" :frequ-line-cap="true"  :line-width="6" :canv-width="30" :canv-height="30" line-color="#FFF"/>
          </div>
        </button>
        </div>
</template>
