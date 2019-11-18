const videoContainer = document.querySelector('.video-container');
const video = videoContainer.querySelector('video');
const controlsContainer = videoContainer.querySelector('.controls-container');
const playPauseButton = controlsContainer.querySelector('.play-pause');
const rewindButton = controlsContainer.querySelector('.rewind');
const fastForwardButton = controlsContainer.querySelector('.fast-forward');
const volumeButton = controlsContainer.querySelector('.volume');
const fullScreenButton = controlsContainer.querySelector('.full-screen');
const playButton = playPauseButton.querySelector('.playing');
const pauseButton = playPauseButton.querySelector('.paused');
const fullVolumeButton = volumeButton.querySelector('.full-volume');
const mutedButton = volumeButton.querySelector('.muted');
const maximizeButton = fullScreenButton.querySelector('.maximize');
const minimizeButton = fullScreenButton.querySelector('.minimize');
const progressBar = videoContainer.querySelector('.progress-bar');
const watchedBar = videoContainer.querySelector('.watched-bar');
const timeLeft = videoContainer.querySelector('.time-remaining');

let controlsTimeout;
controlsContainer.style.opacity = '0';
watchedBar.style.width = '0px';
pauseButton.style.display = 'none';
minimizeButton.style.display = 'none';

const displayControls = () => {
  controlsContainer.style.opacity = '1';
  document.body.style.cursor = 'initial';
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
  }
  controlsTimeout = setTimeout(() => {
    controlsContainer.style.opacity = '0';
    document.body.style.cursor = 'none';
  }, 5000);
};

const togglePlayPause = () => {
  if (video.paused) {
    video.play();
    playButton.style.display = 'none';
    pauseButton.style.display = '';
  } else {
    video.pause();
    playButton.style.display = '';
    pauseButton.style.display = 'none';
  }
};

const toggleMute = () => {
  video.muted = !video.muted;
  if (video.muted) {
    fullVolumeButton.style.display = 'none';
    mutedButton.style.display = '';
  } else {
    fullVolumeButton.style.display = '';
    mutedButton.style.display = 'none';
  }
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const updateTimeRemaining = () => {
  watchedBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
  // TODO: calculate hours as well...
  const totalSecondsRemaining = video.duration - video.currentTime;
  // THANK YOU: BEGANOVICH
  const time = new Date(null);
  time.setSeconds(totalSecondsRemaining);
  let hours = null;

  if(totalSecondsRemaining >= 3600) {
    hours = (time.getHours().toString()).padStart('2', '0');
  }

  let minutes = (time.getMinutes().toString()).padStart('2', '0');
  let seconds = (time.getSeconds().toString()).padStart('2', '0');

  timeLeft.textContent = `${hours ? hours + ':' : ''}${minutes}:${seconds}`;
};

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    maximizeButton.style.display = '';
    minimizeButton.style.display = 'none';
  } else {
    maximizeButton.style.display = 'none';
    minimizeButton.style.display = '';
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    togglePlayPause(); 
  }

  if (event.code === 'KeyM') {
    toggleMute();
  }

  if (event.code === 'KeyF') {
    toggleFullScreen();
  }

  displayControls();
});

document.addEventListener('mousemove', () => {
  displayControls();
});

video.addEventListener('timeupdate', updateTimeRemaining);

progressBar.addEventListener('click', (event) => {
  const pos = (event.pageX  - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
  video.currentTime = pos * video.duration;
});

playPauseButton.addEventListener('click', togglePlayPause);

rewindButton.addEventListener('click', () => {
  video.currentTime -= 10;
});

fastForwardButton.addEventListener('click', () => {
  video.currentTime += 10;
});

volumeButton.addEventListener('click', toggleMute);

fullScreenButton.addEventListener('click', toggleFullScreen);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout( updateTimeRemaining, 10);
  displayControls();
});