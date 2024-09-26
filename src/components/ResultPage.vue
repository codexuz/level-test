<template>
     <div class="mt-6 flex flex-col items-center justify-center w-full" v-if="!isSpeakingStart">
    <ion-card class="w-[95%] sm:w-[600px]">
        <ion-card-header class="ion-text-center">
             <ion-card-title>
                My Result
             </ion-card-title>
        </ion-card-header>
        <ion-card-content class="w-full p-0">
          
            <div class="text-center">
                <h1 class="text-center text-gray-800 mb-2">Grammar & Vocabulary : 40/40</h1>
                <h2 class="text-xl text-slate-900 mb-3">Level: Intermediate</h2>
                <h1 class="text-gray-800 mb-3">Speaking Level</h1>
                <h2 class="text-xl text-slate-900 mb-3 bg-blue-500 mt-3">Elementary</h2>
            </div>

            <br>
        </ion-card-content>
    </ion-card>
</div>
</template>

<script setup>
import {micSharp} from 'ionicons/icons';

</script>