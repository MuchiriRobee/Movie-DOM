document.addEventListener("DOMContentLoaded", function () {
      const list = document.querySelector("#movie-list ul");
      const addMovieForm = document.forms['add-movie'];
      const input = addMovieForm.querySelector('input[type="text"]');
      const submitBtn = document.getElementById("submit-btn");
      const toast = document.getElementById("toast");

      let editMode = false;
      let movieBeingEdited = null;

      // Toast popup function
      function showToast(message, type = "success") {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
          toast.className = "toast";
        }, 3000);
      }

      // delete or edit movies
      list.addEventListener("click", function (e) {
        if (e.target.classList.contains('delete')) {
          const li = e.target.closest("li");
          li.remove();
          showToast("Movie deleted successfully!", "success");
        }

        if (e.target.classList.contains('edit')) {
          movieBeingEdited = e.target.closest("li").querySelector(".name");
          input.value = movieBeingEdited.textContent;
          submitBtn.textContent = "EDIT";
          editMode = true;
        }
      });

      // add or edit movie
      addMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const value = input.value.trim();

        if (!value) {
          showToast("Please enter a movie name!", "error");
          return;
        }

        if (editMode && movieBeingEdited) {
          movieBeingEdited.textContent = value;
          submitBtn.textContent = "ADD";
          editMode = false;
          movieBeingEdited = null;
          showToast("Movie edited successfully!", "success");
        } else {
          const li = document.createElement('li');
          const movieName = document.createElement('span');
          movieName.classList.add('name');
          movieName.textContent = value;

          const actions = document.createElement('span');
          actions.classList.add('actions');
          actions.innerHTML = `
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