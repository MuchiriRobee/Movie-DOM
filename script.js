 const API_KEY = "AIzaSyC7GdKZWeBFd6kywli4ZuyJsWXYOd354VY"; // 🔹 Replace with your Google API key

    document.addEventListener("DOMContentLoaded", function () {
      const list = document.querySelector("#movie-list ul");
      const addMovieForm = document.forms['add-movie'];
      const input = addMovieForm.querySelector('input[type="text"]');
      const submitBtn = document.getElementById("submit-btn");
      const toast = document.getElementById("toast");

      const modal = document.getElementById("trailerModal");
      const trailerFrame = document.getElementById("trailerFrame");
      const closeBtn = document.querySelector(".close");

      let editMode = false;
      let movieBeingEdited = null;

      function showToast(message, type = "success") {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => { toast.className = "toast"; }, 3000);
      }

      // 🔹 Fetch YouTube Trailer
      async function fetchTrailer(movieName) {
        const query = encodeURIComponent(movieName + " trailer");
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}&maxResults=1`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId;
          }
        } catch (err) {
          console.error("YouTube API Error:", err);
        }
        return null;
      }

      list.addEventListener("click", async function (e) {
        if (e.target.classList.contains('delete')) {
          e.target.closest("li").remove();
          showToast("Movie deleted successfully!", "success");
        }
        if (e.target.classList.contains('edit')) {
          movieBeingEdited = e.target.closest("li").querySelector(".name");
          input.value = movieBeingEdited.textContent;
          submitBtn.textContent = "EDIT";
          editMode = true;
        }
        if (e.target.classList.contains('trailer')) {
          const li = e.target.closest("li");
          const movieName = li.querySelector(".name").textContent;
          const videoId = await fetchTrailer(movieName);
          if (videoId) {
            trailerFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            modal.style.display = "flex";
          } else {
            showToast("Trailer not found!", "error");
          }
        }
      });

      closeBtn.onclick = () => {
        modal.style.display = "none";
        trailerFrame.src = "";
      };
      window.onclick = (e) => {
        if (e.target == modal) {
          modal.style.display = "none";
          trailerFrame.src = "";
        }
      };

      addMovieForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const value = input.value.trim();
        if (!value) { showToast("Please enter a movie name!", "error"); return; }

        if (editMode && movieBeingEdited) {
          movieBeingEdited.textContent = value;
          submitBtn.textContent = "ADD";
          editMode = false; movieBeingEdited = null;
          showToast("Movie edited successfully!", "success");
        } else {
          const li = document.createElement('li');
          const movieName = document.createElement('span');
          movieName.classList.add('name');
          movieName.textContent = value;

          const actions = document.createElement('span');
          actions.classList.add('actions');
          actions.innerHTML = `
            <i class="fa fa-film icon-btn trailer"></i>
            <i class="fa fa-edit icon-btn edit"></i>
            <i class="fa fa-trash icon-btn delete"></i>
          `;
          li.appendChild(movieName);
          li.appendChild(actions);
          list.appendChild(li);
          showToast("Movie added successfully!", "success");
        }
        addMovieForm.reset();
      });
    });