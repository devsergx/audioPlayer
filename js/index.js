// playlist
import { playlist } from "./tracks.js";

// Elements
const audioElement = document.getElementById("audio-element");
const cover = document.getElementById("track-cover");
const title = document.getElementById("track-title");
const artist = document.getElementById("track-artist");
const playBtn = document.getElementById("btn-play");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const labelCurrentTime = document.getElementById("current-time");
const labelTotalDuration = document.getElementById("total-duration");
const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");
const volumeBtn = document.querySelector(".volume-control__button");
const volumeBarIcon = document.querySelector(".volume-control__icon");
const volumeBarIconMuted = document.querySelector(
	".volume-control__icon--muted",
);
const playlistContainer = document.getElementById("playlist-list");

// текущий index трека
let currentTrackIndex = 0;

// состояние трека играет / не играет
let isPlaying = false;

// начальная громкость трека
audioElement.volume = 0.3;

// переменная-буфер для последнего значения audioElement
let lastVolume;

// functions
function renderPlaylist() {
	playlistContainer.innerHTML = "";
	playlist.forEach((track, index) => {
		const html = `
			<li class="playlist-item" data-index="${index}">
  			<div class="playlist-item__info">
    			<span class="playlist-item__title">${track.title}</span>
    			<span class="playlist-item__artist">${track.artist}</span>
  			</div>
  				<span class="playlist-item__duration">${formatTime(track.duration)}</span>
			</li>
		`;
		playlistContainer.insertAdjacentHTML("beforeend", html);
	});
}
renderPlaylist();
updateActiveTrack(currentTrackIndex);

function updateActiveTrack(trackIndex) {
	const items = document.querySelectorAll(".playlist-item");
	items.forEach(item => item.classList.remove("playlist-item--active"));
	if (items[trackIndex]) {
		items[trackIndex].classList.add("playlist-item--active");
	}
}

// загружаем информацию о треке
function loadTrack(trackIndex) {
	const track = playlist[trackIndex];

	cover.src = track.cover;
	title.textContent = track.title;
	artist.textContent = track.artist;
	audioElement.src = track.src;
}
loadTrack(currentTrackIndex);

function playTrack() {
	audioElement.play();
	isPlaying = true;
	playBtn.innerHTML = `
	<svg 
		class="icon 
		icon--pause" 
		width="26" 
		height="26" 
		viewBox="0 0 24 24" 
		fill="currentColor">
  		<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
	</svg>`;
}

function pauseTrack() {
	audioElement.pause();
	isPlaying = false;
	playBtn.innerHTML = `
	<svg 
		class="icon icon-play" 
		width="30" 
		height="30" 
		viewBox="0 0 24 24" 
		fill="currentColor">
			<path d="M8 5v14l11-7z" />
	</svg>`;
}

function togglePlay() {
	if (isPlaying) {
		pauseTrack();
	} else {
		playTrack();
	}
}

function nextTrack() {
	currentTrackIndex++;
	if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;

	loadTrack(currentTrackIndex);

	if (isPlaying) playTrack();

	updateActiveTrack(currentTrackIndex);
}

function prevTrack() {
	currentTrackIndex--;
	if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;

	loadTrack(currentTrackIndex);

	if (isPlaying) playTrack();

	updateActiveTrack(currentTrackIndex);
}

// вспомогательная функция форматирование времени
function formatTime(seconds) {
	if (isNaN(seconds)) return "0:00";
	const min = Math.floor(seconds / 60);
	const sec = String(Math.floor(seconds % 60)).padStart(2, 0);
	const time = `${min}:${sec}`;
	return time;
}

// update currentTime and totalDuration
function updateProgress() {
	const { currentTime, duration } = audioElement;
	if (!isNaN(duration)) {
		labelCurrentTime.textContent = formatTime(currentTime);
		labelTotalDuration.textContent = formatTime(duration);
		progressBar.value = (currentTime / duration) * 100;
	}
}

// ручная перемотка трека
function setProgress() {
	if (!isNaN(audioElement.duration)) {
		audioElement.currentTime =
			(progressBar.value / 100) * audioElement.duration;
	}
}

// ручное изменение громкости
function setVolume() {
	audioElement.volume = +volumeBar.value;
	if (audioElement.volume > 0) {
		lastVolume = audioElement.volume;
		volumeBarIcon.classList.remove("hidden");
		volumeBarIconMuted.classList.add("hidden");
	} else {
		volumeBarIcon.classList.add("hidden");
		volumeBarIconMuted.classList.remove("hidden");
	}
}

// mute track по нажатию на иконку звука
function toggleMute() {
	if (audioElement.volume > 0) {
		lastVolume = audioElement.volume;
		volumeBar.value = 0;
		audioElement.volume = 0;
		volumeBarIcon.classList.add("hidden");
		volumeBarIconMuted.classList.remove("hidden");
	} else {
		audioElement.volume = lastVolume;
		volumeBar.value = lastVolume;
		volumeBarIcon.classList.remove("hidden");
		volumeBarIconMuted.classList.add("hidden");
	}
}
// ================= //

// addEventListeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
audioElement.addEventListener("loadedmetadata", updateProgress);
audioElement.addEventListener("timeupdate", updateProgress);
progressBar.addEventListener("input", setProgress);
audioElement.addEventListener("ended", nextTrack);
volumeBar.addEventListener("input", setVolume);
volumeBtn.addEventListener("click", toggleMute);
playlistContainer.addEventListener("click", event => {
	const item = event.target.closest(".playlist-item");
	if (!item) return;

	const itemIndex = +item.dataset.index;
	updateActiveTrack(itemIndex);
	loadTrack(itemIndex);
	playTrack();
});
