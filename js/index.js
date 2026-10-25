// playlist
import playlist from "./tracks.js";

// Elements
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

// init musicPlayer
class MusicPlayer {
	constructor(playlist) {
		this.playlist = playlist;
		this.currentIndex = 0;
		this.isPlaying = false;
		this.lastVolume = 0.3;

		// Сам аудиоплеер браузера
		this.audio = new Audio();
		this.audio.volume = this.lastVolume;

		this.renderPlaylist();
		this.loadTrack();
		this.initListeners();
	}

	loadTrack() {
		const track = this.playlist[this.currentIndex];
		this.audio.src = track.src;
		cover.src = track.cover;
		title.textContent = track.title;
		artist.textContent = track.artist;

		this.updateActiveTrack();
	}

	play() {
		this.audio.play();
		this.isPlaying = true;
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

	pause() {
		this.audio.pause();
		this.isPlaying = false;
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

	togglePlay() {
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}

	next() {
		this.currentIndex++;

		if (this.currentIndex >= this.playlist.length) {
			this.currentIndex = 0;
		}

		this.loadTrack(this.currentIndex);

		if (this.isPlaying) this.play();
	}

	prev() {
		this.currentIndex--;

		if (this.currentIndex < 0) {
			this.currentIndex = this.playlist.length - 1;
		}

		this.loadTrack(this.currentIndex);

		if (this.isPlaying) this.play();
	}

	toggleMute() {
		if (this.audio.volume > 0) {
			this.lastVolume = this.audio.volume;
			volumeBar.value = 0;
			this.audio.volume = 0;
		} else {
			this.audio.volume = this.lastVolume;
			volumeBar.value = this.lastVolume;
		}
		this.toggleMuteIcon();
	}

	toggleMuteIcon() {
		const isMuted = this.audio.volume === 0;

		volumeBarIcon.classList.toggle("hidden", isMuted);
		volumeBarIconMuted.classList.toggle("hidden", !isMuted);
	}

	setVolume() {
		this.audio.volume = +volumeBar.value;

		if (this.audio.volume > 0) {
			this.lastVolume = this.audio.volume;
		}

		this.toggleMuteIcon();
	}

	formatTime(seconds) {
		if (isNaN(seconds)) return "0:00";
		const min = Math.floor(seconds / 60);
		const sec = String(Math.floor(seconds % 60)).padStart(2, 0);
		const time = `${min}:${sec}`;
		return time;
	}

	updateProgress() {
		const { currentTime, duration } = this.audio;

		labelTotalDuration.textContent = this.formatTime(duration);

		if (!isNaN(duration)) {
			labelCurrentTime.textContent = this.formatTime(currentTime);
			progressBar.value = (currentTime / duration) * 100;
		}
	}

	setProgress() {
		if (!isNaN(this.audio.duration)) {
			this.audio.currentTime = (progressBar.value / 100) * this.audio.duration;
		}
	}

	renderPlaylist() {
		playlistContainer.innerHTML = this.playlist
			.map((track, index) => {
				return `
			<li class="playlist-item" data-index="${index}">
  			<div class="playlist-item__info">
    			<span class="playlist-item__title">${track.title}</span>
    			<span class="playlist-item__artist">${track.artist}</span>
  			</div>
  				<span class="playlist-item__duration">${this.formatTime(track.duration)}</span>
			</li>
		`;
			})
			.join("");
	}

	updateActiveTrack() {
		const items = document.querySelectorAll(".playlist-item");
		items.forEach(item => item.classList.remove("playlist-item--active"));
		if (items[this.currentIndex]) {
			items[this.currentIndex].classList.add("playlist-item--active");
		}
	}

	initListeners() {
		// 1. Кнопки управления плеером
		playBtn.addEventListener("click", () => this.togglePlay());
		nextBtn.addEventListener("click", () => this.next());
		prevBtn.addEventListener("click", () => this.prev());

		// 2. Управление звуком
		volumeBar.addEventListener("input", () => this.setVolume());
		volumeBtn.addEventListener("click", () => {
			this.toggleMute();
		});

		// 3. Полоса прогресса и события аудио
		progressBar.addEventListener("input", () => this.setProgress());
		this.audio.addEventListener("timeupdate", () => this.updateProgress());
		this.audio.addEventListener("loadedmetadata", () => this.updateProgress());
		this.audio.addEventListener("ended", () => this.next());

		// 4. Делегирование клика по плейлисту
		playlistContainer.addEventListener("click", event => {
			const item = event.target.closest(".playlist-item");
			if (!item) return;

			const itemIndex = +item.dataset.index;
			this.currentIndex = itemIndex;
			this.updateActiveTrack(itemIndex);
			this.loadTrack(itemIndex);
			this.play();
		});

		// 5. Управление с клавиатуры (пробел)
		document.body.addEventListener("keydown", e => {
			if (e.code === "Space") {
				e.preventDefault();
				this.togglePlay();
			}
		});
	}
}

const player = new MusicPlayer(playlist);
