<template>
  <ion-page>
    <ion-header class="border-b-4 border-blue-600">
      <ion-toolbar>
        <div class="flex items-center justify-center p-2">
          <ion-img :src="Logo" class="mx-auto w-[140px]" slot="start"></ion-img>
        </div>
        <ion-badge slot="end" v-if="counting" class="p-2 mr-2">
        <vue-countdown  @end="finishAndStartSpeaking"  class="px-2" :time="timer" :transform="transformSlotProps" v-slot="{ minutes, seconds }">
         {{ minutes }}:{{ seconds }}
         </vue-countdown>
        </ion-badge>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <template v-if="!isGrammarPart">
    <div class="mt-6 flex flex-col items-center justify-center w-full" v-if="!isStarted">
        <ion-card class="w-[95%] sm:w-[600px]">
            <ion-card-header class="ion-text-center">
                 <ion-card-title>
                  Grammar and Vocabulary
                 </ion-card-title>
                 <ion-card-subtitle>
                  You are about to start the  Grammar and Vocabulary section.
                 </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content class="w-full p-0">
              <div class="w-full flex flex-col  items-center justify-center h-[120px] bg-[#f0f7fc]">
                   <ion-icon :icon="bookOutline" class="w-10 h-10 text-[#0075e1]"></ion-icon>
                   <br>
                   <ion-text color="dark">
                    Grammar & Vocabulary
                   </ion-text>
                   <ion-text color="dark">
                     <b>40 Questions</b>
                   </ion-text>
              </div>
                <ul class="list-disc p-9">
                   <li>The questions in this test may get harder or easier to adapt to your level.

                   </li>
                   <li>
                    You will not lose points for incorrect answers.
                   </li>
                   <li>
                    Once you submit an exercise, you cannot go back.
                   </li>
                </ul>

                <br>
               
                <div class="flex items-center justify-center flex-col w-full mb-4 sm:w-auto">
                    <ion-button @click="startQuiz" expand="block" shape="round">Start Quiz</ion-button>
                </div>
            </ion-card-content>
        </ion-card>
    </div>


    <div class="mt-6 flex flex-col items-center justify-center w-full" v-else>
        <ion-card class="w-[95%] sm:w-[600px]">
          <ion-card-header class="ion-text-left">
            <ion-badge class="px-4 w-13 absolute right-3 top-3">{{ currentQuestionIndex+1}}/40</ion-badge>
                 <p class="text-gray-700 px-4 font-bold pt-3">
                  {{ quizQuestions[currentQuestionIndex].text }}
                 </p>
            </ion-card-header>
            <ion-card-content class="w-full">
              <ion-radio-group class="w-full" v-model="selectedAnswer" mode="md" @ionChange="getValue($event)">
              <ion-radio   v-for="(answer, i) in quizQuestions[currentQuestionIndex].answers"
                  :key="i"
                  :value="answer"
                  label-placement="end"
                  justify="start"
                  class="w-full  py-4 bg-blue-100/60 m-1 text-slate-800 px-4 rounded-lg">
                  {{ answer }}
                </ion-radio>
            </ion-radio-group>
            </ion-card-content>
        </ion-card>
    </div>
     
    <div class="flex items-center justify-center">
      <ion-button  v-if="isStarted" @click="nextQuestion" :disabled="!selectedAnswer" shape="round">Next</ion-button>
    </div>
  </template>
  <template v-else>
    <speaking-card/>
  </template>
  
  <ion-fab @click="enterFullScreen" slot="fixed" vertical="bottom" horizontal="end" class="m-3">
    <ion-fab-button>
      <svg v-if="!isFullscreen" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 48 48"><path d="M43.8 0l-9.9 0 0 4 7.6 0L28 17.5l2.8 2.8 13-13 0 6.5 3.9 0 0-9.8 0-4Z"></path><path d="M17.2 27.7l-13 13 0-6.5 -3.9 0 0 9.8 0 4 3.9 0 9.9 0 0-4 -7.6 0L20 30.5Z"></path></svg>
      <svg v-if="isFullscreen" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 48 48" data-test-id="fullscreen-exit-icon"><path d="M30.8 20.8l8.6 0 0-3.4 -6.6 0L44.5 5.7l-2.4-2.4 -11.3 11.2 0-5.6 -3.4 0 0 8.5 0 3.4Z"></path><path d="M5.9 44.7l11.3-11.2 0 5.6 3.4 0 0-8.5 0-3.4 -3.4 0 -8.6 0 0 3.4 6.6 0L3.5 42.3Z"></path></svg>
    </ion-fab-button>
  </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonIcon, IonButton, IonRadio, IonRadioGroup, IonBadge, IonFab, IonFabButton } from '@ionic/vue';
import { useFullscreen } from '@vueuse/core'
import {bookOutline} from 'ionicons/icons';
import Logo from '@/assets/logo.png'
import SpeakingCard from '../components/SpeakingCard.vue';
import { useStore } from '@/stores/store';
const store = useStore();

const isGrammarPart = ref(false)
const currentQuestionIndex = ref(0)
const isStarted = ref(false);
const selectedAnswer = ref(null); // To store the selected answer
const userAnswers = ref([])
const activeButton = ref(false);
const counting = ref(false)
const { isFullscreen, toggle } = useFullscreen()
const timer = ref(1800000)

function enterFullScreen () {
toggle()
}

const transformSlotProps = (props) => {
      const formattedProps = {};

      Object.entries(props).forEach(([key, value]) => {
        formattedProps[key] = value < 10 ? `0${value}` : String(value);
      });

      return formattedProps;
}


function startQuiz () {
  isStarted.value = true
  counting.value = true
}

function getValue(ev){
  activeButton.value = true
}

let score = 0;

async function nextQuestion() {

  // Ensure the current question index is within the range of available questions
  if (currentQuestionIndex.value < quizQuestions.value.length-1) {
    // Ensure that the user has selected an answer before proceeding
    if (selectedAnswer.value) {
      console.log('Selected answer:', selectedAnswer.value);

      // Push the selected answer to the userAnswers array
      userAnswers.value.push(selectedAnswer.value);
      console.log(userAnswers.value);

      // Check if the selected answer matches the correct answer for the current question
      const currentQuestion = quizQuestions.value[currentQuestionIndex.value];
      if (selectedAnswer.value === currentQuestion.correctAnswer) {
        score++;
        console.log('Correct! Score:', score);
      }

      // Proceed to the next question by incrementing the index
      currentQuestionIndex.value++;

      // Reset the selected answer for the next question
      selectedAnswer.value = null;

      // Disable the button after answering the question
      activeButton.value = false;
    } else {
      console.log('No answer selected.');
    }
  } else {
    // Quiz has ended
    console.log('Quiz ended. Final score:', score);
    let level = getGrammarLevel(score)
    let result ={
          score: score,
          level: level
        }

    store.result = result
    await store.saveResult() 
    finishAndStartSpeaking()
    
  }
}



function getGrammarLevel(score) {
  if(score <= 20) {
    return "Elementary";
  } else if(score > 20 && score <= 30) {
    return "Pre-Intermediate";
  } else if(score > 30) {
    return "Intermediate";
  }
}

if(timer.value <=0){
  counting.value = false;
  finishAndStartSpeaking()
}

function finishAndStartSpeaking () {
  isGrammarPart.value = true;
  counting.value = false
}





// Mock data for quiz
const quizQuestions = ref([
  { "text": "____ you interested in sport?", "answers": ["Be", "Am", "Is", "Are"], "correctAnswer": "Are" },
  { "text": "My ____ is a writer and his books are very popular.", "answers": ["aunt", "uncle", "sister", "mother"], "correctAnswer": "uncle" },
  { "text": "Paul is very ____. He’s very good at art.", "answers": ["honest", "friendly", "polite", "creative"], "correctAnswer": "creative" },
  { "text": "We live in the city centre and our house ____ have a big garden.", "answers": ["doesn’t", "isn’t", "aren’t", "don’t"], "correctAnswer": "doesn’t" },
  { "text": "I ____ arrive at school before nine o’clock.", "answers": ["has to", "have to", "doesn’t have to", "haven’t to"], "correctAnswer": "have to" },
  { "text": "The beach was very crowded ____ Monday.", "answers": ["in", "on", "with", "to"], "correctAnswer": "on" },
  { "text": "You ____ eat all that cake! It isn’t good for you.", "answers": ["don’t", "may not", "shouldn’t", "will not"], "correctAnswer": "shouldn’t" },
  { "text": "Cathy ____ a game on her computer at the moment.", "answers": ["plays", "is playing", "to play", "play"], "correctAnswer": "is playing" },
  { "text": "There ____ a lot of people outside the school. What’s the problem?", "answers": ["are", "is", "be", "am"], "correctAnswer": "are" },
  { "text": "____ you like to come out with us tonight?", "answers": ["Do", "Would", "Are", "Will"], "correctAnswer": "Would" },
  { "text": "How ____ time have we got to do this exercise?", "answers": ["long", "many", "much", "quick"], "correctAnswer": "much" },
  { "text": "Turn ____ and you’ll see the museum on the left.", "answers": ["on the right", "rightly", "by the right", "right"], "correctAnswer": "right" },
  { "text": "Don’t forget to get ____ the bus at Station Road.", "answers": ["out", "off", "over", "down"], "correctAnswer": "off" },
  { "text": "Tom got the ____ marks in the class for his homework.", "answers": ["worse", "worst", "baddest", "most bad"], "correctAnswer": "worst" },
  { "text": "There wasn’t ____ milk for breakfast this morning so I had toast and orange juice.", "answers": ["a", "some", "the", "any"], "correctAnswer": "any" },
  { "text": "My sister ____ speak French when she was only six years old.", "answers": ["was", "should", "could", "had"], "correctAnswer": "could" },
  { "text": "Did you ____ shopping after school yesterday?", "answers": ["went", "goed", "going", "go"], "correctAnswer": "go" },
  { "text": "I ____ five emails before school today.", "answers": ["sent", "sended", "did send", "was send"], "correctAnswer": "sent" },
  { "text": "Our teacher speaks English to us ____ so that we can understand her.", "answers": ["slow", "slower", "more slow", "slowly"], "correctAnswer": "slowly" },
  { "text": "Quick – get the food inside! It ____ any moment.", "answers": ["rains", "is raining", "is going to rain", "can rain"], "correctAnswer": "is going to rain" },
  { "text": "I ____ the new Batman film yet. Is it any good?", "answers": ["haven’t seen", "didn’t see", "don’t see", "am not seen"], "correctAnswer": "haven’t seen" },
  { "text": "I hope you ____ a good time at the moment in Greece! Phone soon.", "answers": ["are having", "have", "have had", "had"], "correctAnswer": "are having" },
  { "text": "I wanted to see Harry. How long ago ____ ?", "answers": ["he left", "has he left", "did he leave", "could he leave"], "correctAnswer": "did he leave" },
  { "text": "Do students in your country have to stand ____ when the teacher arrives?", "answers": ["on", "at", "in", "up"], "correctAnswer": "up" },
  { "text": "Which train ____ for when I saw you on the platform on Sunday?", "answers": ["did you wait", "were you waiting", "have you waited", "are you waiting"], "correctAnswer": "were you waiting" },
  { "text": "You ____ hurry as we’ve still got twenty minutes before the film starts.", "answers": ["mustn’t", "can’t", "may not", "needn’t"], "correctAnswer": "needn’t" },
  { "text": "That car is ____ dangerous to drive.", "answers": ["too", "enough", "not enough", "the worst"], "correctAnswer": "too" },
  { "text": "I ____ you in the café at about 4.30 and we can discuss our plans then, OK?", "answers": ["’ll see", "am going to see", "am seeing", "see"], "correctAnswer": "’ll see" },
  { "text": "My father has been a pilot ____ twenty years and he still loves his job.", "answers": ["since", "for", "until", "by"], "correctAnswer": "for" },
  { "text": "I really enjoy ____ new languages and I’d like to learn Italian soon.", "answers": ["to learn", "learning", "learn", "learned"], "correctAnswer": "learning" },
  { "text": "If we ____ in the countryside, we’d have much better views than we do now.", "answers": ["lived", "were live", "would live", "live"], "correctAnswer": "lived" },
  { "text": "I wish Joe ____ to Hawaii on holiday. They’re talking about an eruption there on the news.", "answers": ["doesn’t go", "didn’t go", "hasn’t gone", "hadn’t gone"], "correctAnswer": "didn’t go" },
  { "text": "Could I possibly ____ some money for the bus fare home? I’ve lost my bag.", "answers": ["lend", "owe", "borrow", "need"], "correctAnswer": "borrow" },
  { "text": "Sam asked me if I ____ a lift home after the concert.", "answers": ["had wanted", "wanted", "would want", "want"], "correctAnswer": "wanted" },
  { "text": "People say that an avalanche ____ by loud noises in the area but I don’t know if that’s true.", "answers": ["causes", "has caused", "is causing", "is caused"], "correctAnswer": "is caused" },
  { "text": "Look at the news! Three cars ____ in a bad accident on the motorway at Dartford.", "answers": ["are involving", "involve", "have involved", "have been involved"], "correctAnswer": "have been involved" },
  { "text": "I ____ for arriving so late but I was caught up in a traffic jam in the town centre.", "answers": ["sorry", "regret", "apologise", "afraid"], "correctAnswer": "apologise" },
  { "text": "Look out for a petrol station because I think we’re going to run ____ of petrol soon.", "answers": ["down", "out", "off", "through"], "correctAnswer": "out" },
  { "text": "It was great to see you at the party. I didn’t realize how long ____ since we last met.", "answers": ["it had been", "it was been", "it was being", "it is been"], "correctAnswer": "it had been" },
  { "text": "The girls ____ to each other since the film started.", "answers": ["talked", "were talking", "are talking", "have been talking"], "correctAnswer": "have been talking" }
])

</script>

<style scoped>
ion-content{
  --background: #e0eefb
}
</style>
