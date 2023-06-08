import Notiflix from 'notiflix';
import simpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchData from './js/api.js';

const searchForm = document.querySelector('#search-form');
const inputField = document.querySelector('input[type="text"]');
const divGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let pageNumber = 1;
let inputtedValueCompare = '';
let counter = 1;
let lightBoxInstance = null;
let totalHitsValue = 0;

loadMoreBtn.classList.add('hidden');

// Результат позитивний, тоді виконати
const handleSuccess = function (data) {
  if (data.totalHits !== 0) {
    totalHitsValue = data.totalHits;
    if (inputField.value !== inputtedValueCompare) {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    }
    data.hits.forEach(hit => {
        if(counter <= totalHitsValue){
        console.log(counter)
        console.log(totalHitsValue)
      divGallery.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
                    <a href="${hit.largeImageURL}">
                        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="image-gallery"/>
                        </a>
                        <div class="info">
                        <p class="info-item">
                            <b>Number ${counter}</b>
                        </p>
                        <p class="info-item">
                            <b>Likes ${hit.likes}</b>
                        </p>
                        <p class="info-item">
                            <b>Views ${hit.views}</b>
                        </p>
                        <p class="info-item">
                            <b>Comments ${hit.comments}</b>
                            </p>
                            <p class="info-item">
                            <b>Downloads ${hit.downloads}</b>
                            </p>
                            </div>`
      );

      counter += 1;
      loadMoreBtn.classList.remove('hidden');}

      if (counter > data.totalHits) {
        loadMoreBtn.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
    if (lightBoxInstance) {
      lightBoxInstance.destroy();
    }
    lightBoxInstance = new simpleLightBox('.photo-card a', {});

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    inputField.value = '';
  }

  inputtedValueCompare = inputField.value;
};

//Функція виконання на сабміт, з умовою пагінації
const onClick = function (e) {
  e.preventDefault();
  const inputtedValue = inputField.value;
  if (inputtedValue === '') {
    return Notiflix.Notify.info('Please enter a search query');
  }
  if (inputtedValue !== inputtedValueCompare) {
    divGallery.innerHTML = '';
    counter = 1;
    fetchData(inputtedValue, pageNumber)
      .then(handleSuccess)
      .catch(error => {
        console.log(error);
        Notiflix.Notify.failure('An error occurred while fetching data.');
      });
  } else {
    Notiflix.Notify.info(
      'If you need more images, please push button "Load more" in the bottom of the page'
    );
  }
};

//Функція виконання на loadMore, з умовою пагінації
const loadMore = function (e) {
  const inputtedValue = inputField.value;
  if (inputtedValue === inputtedValueCompare) {
    loadMoreBtn.classList.add('hidden');
    pageNumber += 1;
    fetchData(inputtedValue, pageNumber).then(handleSuccess);
}};

//infifnity scroll
const handleScroll = function () {
  const scrolledToBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (scrolledToBottom) {
    loadMore();
  }
};
window.addEventListener('scroll', handleScroll);

searchForm.addEventListener('submit', onClick);
loadMoreBtn.addEventListener('click', loadMore);
