<template>
  <!-- Introduction Section -->
  <div v-show="!isSpeakingStart" class="mt-6 flex flex-col items-center justify-center w-full">
    <ion-card class="w-[95%] sm:w-[600px]">
      <ion-card-header class="ion-text-center">
        <ion-card-title>Speaking Section</ion-card-title>
        <ion-card-subtitle>You are about to start the Speaking section.</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content class="w-full p-0">
        <div class="w-full flex flex-col items-center justify-center h-[120px] bg-[#f0f7fc]">
          <ion-icon :icon="micSharp" class="w-10 h-10 text-[#0075e1]"></ion-icon>
          <br />
          <ion-text color="dark">Speaking Section</ion-text>
          <ion-text color="dark"><b>5-6 Questions</b></ion-text>
        </div>
        <ul class="list-disc p-9">
          <li>The virtual examiner asks questions about yourself and your life.</li>
          <li>You will be given 5 seconds for preparation and 1 minute to speak for each question.</li>
        </ul>
        <div class="flex items-center justify-center w-full mb-4">
          <ion-button @click="startSpeaking" expand="block" shape="round">Start Speaking</ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </div>

  <!-- Speaking Section -->
  <div v-show="isSpeakingStart" class="mt-6 flex flex-col items-center justify-center w-full">
    <ion-card class="w-[95%] sm:w-[600px]">
      <ion-card-content>
        <!-- Video and Text -->
        <div class="w-full flex flex-col items-center justify-center">
          <video ref="video" :poster="Poster" class="w-full"></video>
        </div>
        <div class="text-center mt-5">
          <h2 class="text-slate-800 text-2xl">{{ speakingText }}</h2>
        </div>
        
        <!-- Audio Visualization -->
        <div class="flex flex-col items-center justify-center w-full">
          <AVMedia :media="stream" type="frequ" :frequ-lnum="6" :frequ-line-cap="true" :line-width="2" :canv-width="30" :canv-height="30" line-color="#00ff00"/>
        </div>

        <!-- Ready Button and Timer -->
        <div class="w-full flex items-center justify-center mb-3 mt-4">
          <ion-button v-if="showReadyButton" shape="round" @click="onReadyClick">I'm Ready</ion-button>
          <ion-button v-else shape="round">{{ time < 10 ? `00: 0${time}`: `00: ${time}` }}</ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonIcon, IonButton } from '@ionic/vue';
import { micSharp } from 'ionicons/icons';
import { useSpeechRecognition, useUserMedia } from '@vueuse/core';
import { AVMedia } from 'vue-audio-visual';

// Media and Assets
import Poster from '@/assets/audios/poster.png';
import VideoIntro from '@/assets/audios/intro.mp4';
import Video1 from '@/assets/audios/1.mp4';
import Video2 from '@/assets/audios/2.mp4';
import Video3 from '@/assets/audios/3.mp4';
import Video4 from '@/assets/audios/4.mp4';
import Video5 from '@/assets/audios/5.mp4';
import Video6 from '@/assets/audios/6.mp4';
import Video7 from '@/assets/audios/7.mp4';
import Video8 from '@/assets/audios/8.mp4';

// Use User Media (Microphone)
const { stream, enabled } = useUserMedia({ constraints: { audio: true } });



// State Variables
const isSpeakingStart = ref(false);
const currentIndex = ref(0);
const videoRef = useTemplateRef('video')
const speakingText = ref('');
const showReadyButton = ref(true);
const time = ref(60);

// Speaking Questions with Videos
const speakingQuestions = ref([
  { video: VideoIntro, text: 'Welcome, My name is Elsa. I am your virtual examiner today?' },
  { video: Video1, text: 'Where do you study?' },
  { video: Video2, text: 'What subjects do you study?' },
  { video: Video3, text: 'Can you describe your family?' },
  { video: Video4, text: 'What do you like to do in your free time?' },
  { video: Video5, text: 'Can you describe a typical day in your life?' },
  { video: Video6, text: 'What do you usually have for breakfast?' },
  { video: Video7, text: 'What is your favourite sport? And why do you like it?' },
  { video: Video8, text: 'What do you want to do in the future?' }
]);

// Start Speaking Section
function startSpeaking() {
  isSpeakingStart.value = true;
  loadNextVideo();
}

// Ready Button Click: Start Recording and Timer
function onReadyClick() {
  showReadyButton.value = false; // Hide the "I'm Ready" button
  startRecording(); // Start speech recognition
  startTimer(); // Start countdown timer
}

// Load and Play the Next Video
function loadNextVideo() {
  if (currentIndex.value < speakingQuestions.value.length) {
    videoRef.value.src = speakingQuestions.value[currentIndex.value].video;
    speakingText.value = speakingQuestions.value[currentIndex.value].text;
    videoRef.value.play();
    videoRef.value.onended = () => {
      showReadyButton.value = true; // Show "I'm Ready" button after video ends
    };
  }
}

// Move to the Next Question
function nextQuestion() {
  currentIndex.value++;
  loadNextVideo();
}

// Countdown Timer and Stop Recording
let interval;
function startTimer() {
  time.value = 60;
  interval = setInterval(() => {
    if (time.value > 0) {
      time.value--;
    } else {
      clearInterval(interval);
      stopRecording(); // Stop recording after time reaches 0
      nextQuestion(); // Load the next video
    }
  }, 1000);
}

// Stop Timer (optional, in case you want to manually stop the timer)
function stopTimer() {
  clearInterval(interval);
}


function startRecording () {
  enabled.value = true
}

function stopRecording () {
  enabled.value = false
}

onMounted(() => {
  // Cleanup when component unmounts
  return () => {
    clearInterval(interval);
  };
});
</script>

<style scoped>
video {
  width: 100%;
  max-width: 600px;
}
</style>
