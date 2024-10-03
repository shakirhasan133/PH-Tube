// lOAD CATEGORIES
function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => {
      showCategories(data.categories);
    });
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  console.log(buttons);
  for (let btn of buttons) {
    btn.classList.remove("btn-info");
  }
};

// Function for fetch video details

function videoDes(vid) {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${vid}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const modalBox = document.getElementById("modalBox");
      const showmodal = document.getElementById("my_modal_2");
      showmodal.showModal();

      modalBox.innerHTML = `
        <img src = "${data.video?.thumbnail}" class="w-full h-[250px] object-cover"/>
         <p class="font-mono px-2 py-2">${data.video?.description}</p>
        

         <form method="dialog" class="modal-backdrop">
          <button class="btn btn-success">Close</button>
          </form>
      `;
    });
}

// showCatagories in Dom
const showCategories = (catName) => {
  catName.forEach((element) => {
    const categoriesDiv = document.createElement("div");
    categoriesDiv.classList.add("flex");
    categoriesDiv.innerHTML = `
          <button id = "btn-${element.category_id}" class = "btn  category-btn" onclick="loadVideoOnCat(${element.category_id})">
          ${element.category}
          </button>
      `;
    document.getElementById("categories").append(categoriesDiv);
  });
};

function loadVideoOnCat(id) {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      displayVideo(data.category);
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("btn-info");
    });
}

const loadMedia = async (title = "") => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${title}`
    );
    const data = await res.json();
    displayVideo(data.videos);
  } catch (error) {
    console.error(error);
  }
};

function displayVideo(videos) {
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";

  if (videos.length === 0) {
    cardContainer.classList.remove("grid");
    cardContainer.innerHTML = `
    <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
    
      <img src="assets/Icon.png" /> 
      <h2 class="text-center text-xl font-bold"> No Content Here in this Categery </h2> 
    </div>`;
  } else {
    cardContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
    
    <figure class="rounded h-[200px] relative cursor-pointer">
            <img
              onclick="videoDes('${video.video_id}')"
              class="w-full h-full object-cover"
              src="${video.thumbnail}"
              alt=""
            />

            ${
              video.others?.posted_date.length === 0
                ? ""
                : `<span class="text-xs bg-black text-white absolute right-3 bottom-3 px-1">
              ${timeCalculator(video.others?.posted_date)}

              </span>
          `
            }

            
          </figure>

          <div class="px-0 py-2">
            <div class="flex gap-2">
              <div class="w-[40px] h-[40px]">
                <img
                  class="rounded-full object-fill h-full w-full"
                  src="${video.authors[0]?.profile_picture}"
                  alt=""
                />
              </div>
              <div>
                <h2 class="font-bold text-[16px]">
                ${video.title}
                </h2>
                <div class="flex items-center gap-1">
                  <p>${video.authors[0]?.profile_name}</p>

                  ${
                    video.authors[0]?.verified === true
                      ? `<img
                        class="w-[20px] h-[20px]"
                        src="https://img.icons8.com/?size=48&id=SRJUuaAShjVD&format=png"
                      />`
                      : ""
                  }
                 
                </div>
              </div>
            </div>
          </div>



  `;

    cardContainer.append(card);
  });
}
function timeCalculator(postedDate) {
  let timeInSeconds = parseInt(postedDate);
  console.log(postedDate.length);

  if (postedDate.length > 4) {
    let hour = Math.floor(timeInSeconds / 3600);
    let second = timeInSeconds % 3600;
    let minute = Math.floor(second / 60);
    second = second % 60;

    let hourStr = hour === 1 ? `${hour} hour` : `${hour} hours`;
    let minuteStr = minute === 1 ? `${minute} minute` : `${minute} minutes`;
    let secondStr = second === 1 ? `${second} second` : `${second} seconds`;

    return `${hourStr} ${minuteStr} ${secondStr} ago`;
  } else if (postedDate.length > 4 && postedDate.length < 7) {
    let days = Math.floor(timeInSeconds / (24 * 60 * 60));
    return `${days} days ago`;
  } else if (postedDate.length >= 7) {
    let days = Math.floor(timeInSeconds / (24 * 60 * 60));
    let months = Math.floor(days / 30);
    let remainingDays = days % 30;

    return `${months} Month ${remainingDays} days ago`;
  }
}

const inputSerarch = document
  .getElementById("inputSerarch")
  .addEventListener("keyup", (e) => {
    loadMedia(e.target.value);
  });

loadMedia();
loadCategories();
