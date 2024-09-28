<template>
  <div class="box">
  <div class="left"></div>
  <div class="right"></div>
</div>
</template>

<style scoped>
  .box {
    height: 5px;
    width: 300px;
    background: #f0f0f0;
    overflow: hidden;
    position: relative;
    border-radius: 30px;
  }

  .left, .right {
    background: #02d67e;
    height: 100%;
    position: absolute;
  }

  .left {
    left: 50%;
    animation: leftAnime 4s infinite ease-in-out;
  }

  .right {
    right: 50%;
    animation: rightAnime 4s infinite ease-in-out;
  }

  @keyframes leftAnime {
    0%, 100% {
      width: 0;
      left: 50%;
    }
    50% {
      width: 50%;
      left: 0;
    }
  }

  @keyframes rightAnime {
    0%, 100% {
      width: 0;
      right: 50%;
    }
    50% {
      width: 50%;
      right: 0;
    }
  }
</style>