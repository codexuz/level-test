<template>
  <!-- Introduction Section -->
  <div v-show="showIntro" class="mt-6 flex flex-col items-center justify-center w-full">
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
          <ion-text color="dark"><b>7-8 Questions</b></ion-text>
        </div>
        <ul class="list-disc p-9">
          <li>The virtual examiner asks questions about yourself and your life.</li>
          <li>You will be given 40 seconds to speak for each question.</li>
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
          <p class="mt-6">{{ transcribedText }}</p>
        </div>

        <!---- Progress Bar ----->
        <div class="flex flex-col items-center justify-center">
        <Progress v-if="shoProgressBar"/>
        </div>
        
        <!-- Audio Visualization -->
        <div v-if="showBar" class="flex flex-col items-center justify-center w-full">
          <AVMedia :media="stream" type="frequ" :frequ-lnum="6" :frequ-line-cap="true" :line-width="2" :canv-width="30" :canv-height="30" line-color="#00ff00"/>
        </div>

        <!-- Ready Button and Timer -->
        <div class="w-full flex items-center justify-center gap-x- mb-3 mt-4">
          <ion-button v-if="showReadyButton" shape="round" @click="onReadyClick">I'm Ready</ion-button>
          <ion-button color="danger" v-if="showTimerButton" shape="round">
            <div class="w-3 h-3 bg-white mr-2 rounded-full animate-blink"></div>
            {{ time < 10 ? `00: 0${time}`: `00: ${time}` }}
          </ion-button>
          <button @click="skipQuestion" v-if="skipButton">
            <svg class="size-10 text-blue-600" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16"><path fill="currentColor" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.042-.018a.75.75 0 0 1-.018-1.042L9.94 8L6.22 4.28a.75.75 0 0 1 0-1.06"/></svg>
          </button>
          <button v-if="finishButton">
            Finish Exam
          </button>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
  <ResultPage v-if="showResultPage" :gr_score="38" :score="4.5" level="Pre-Intermediate"/>
</template>

<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonIcon, IonButton } from '@ionic/vue';
import {  micSharp } from 'ionicons/icons';
import { AVMedia } from 'vue-audio-visual';
import { RecordRTCPromisesHandler } from 'recordrtc';
import Progress from './Progress.vue';
import ResultPage from './ResultPage.vue';
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



// State Variables
const showIntro = ref(true)
const isSpeakingStart = ref(false);
const currentIndex = ref(0);
const videoRef = useTemplateRef('video')
const speakingText = ref('');
const showReadyButton = ref(false);
const time = ref(40);
const showBar = ref(false)
const isExamStarted = ref(false)
const showTimerButton = ref(false);
let stream = ref(null)
let recorder = ref(null);
const shoProgressBar = ref(false);
const skipButton = ref(false);
const transcribedText = ref('')
const finishButton = ref(false);
const showResultPage = ref(false)
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
  showIntro.value = false
  loadNextVideo();
}

// Ready Button Click: Start Recording and Timer
function onReadyClick() {
  showReadyButton.value = false; // Hide the "I'm Ready" button
  nextQuestion();
}

// Load and Play the Next Video
function loadNextVideo() {
  if (currentIndex.value < speakingQuestions.value.length) {
    videoRef.value.src = speakingQuestions.value[currentIndex.value].video;
    speakingText.value = speakingQuestions.value[currentIndex.value].text;
    videoRef.value.play();
    videoRef.value.onended = () => {
      if(!isExamStarted.value){
         showReadyButton.value = true; // Show "I'm Ready" button after video ends
         isExamStarted.value = true
      }
      else{
        startRecording()
        startTimer()
      }
    };
  }
}

// Move to the Next Question
function nextQuestion() {
  if (currentIndex.value < speakingQuestions.value.length -1) {
  currentIndex.value++;
  skipButton.value = false;
  showBar.value = false 
  loadNextVideo();
  }
  else{
      showResultPage.value = true;
      isSpeakingStart.value = false;
      showIntro.value = false;
      stopTimer()
  }
}

function skipQuestion () {
  skipButton.value = false
  showTimerButton.value = false;
  stopRecording()
  stopTimer()
}

// Countdown Timer and Stop Recording
let interval;
function startTimer() {
  time.value = 40;
  interval = setInterval(() => {
    if(time.value === 30){
      skipButton.value = true
    }
    if (time.value > 0) {
      time.value--;
    } else {
      clearInterval(interval);
      stopRecording(); // Stop recording after time reaches 0
    }
  }, 1000);
}

// Stop Timer (optional, in case you want to manually stop the timer)
function stopTimer() {
  clearInterval(interval);
}


   

async function startRecording () {
  stream.value = await navigator.mediaDevices.getUserMedia({audio: true});
   recorder.value = new RecordRTCPromisesHandler(stream.value, {
    type: 'audio/webm'
   });
  showBar.value = true;
  showTimerButton.value = true;
  recorder.value.startRecording();

}

async function stopRecording () {
  showBar.value = false;
  shoProgressBar.value = true;
  speakingText.value = "Processing your response..."
  skipButton.value = false
  showTimerButton.value = false;
  await recorder.value.stopRecording();
   let blob = recorder.value.blob
  await transcribeAudio(blob)
}


const transcribeAudio = async (blob) => {
  const formData = new FormData();
  formData.append("file", blob);
  const res = await fetch("https://edumoacademy.uz/evaluate", {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  console.log(data)
  if(data){
    shoProgressBar.value = false;
    transcribedText.value = data || ''
    nextQuestion();
  }
}

onMounted( async() => {
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

.animate-blink{
  animation-name: blink;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes blink {
  0%{
    opacity: 1;
  }
  100%{
    opacity: .2;
  }
}
</style>
