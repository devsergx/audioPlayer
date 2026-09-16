"use strict";

// playlist
import { playlist } from "./tracks.js";

// ========================================================= //

// elements
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

// текущий трек
let currentTrackIndex = 0;

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
}

function prevTrack() {
	currentTrackIndex--;
	if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;

	loadTrack(currentTrackIndex);

	if (isPlaying) playTrack();
}
// ================= //

let isPlaying = false;

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// форматирование времени
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
audioElement.addEventListener("loadedmetadata", updateProgress);
audioElement.addEventListener("timeupdate", updateProgress);

// ручная перемотка трека
function setProgress() {
	if (!isNaN(audioElement.duration)) {
		audioElement.currentTime =
			(progressBar.value / 100) * audioElement.duration;
	}
}
progressBar.addEventListener("input", setProgress);

// загрузка нового трека после конца предыдущего
audioElement.addEventListener("ended", () => {
	nextTrack();
});
