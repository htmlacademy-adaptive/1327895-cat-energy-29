const toogleButtonElement = document.querySelector('.main-header__toggle');
const menuElement = document.querySelector('.main-nav');
const nojsElement = document.querySelector('.no-js');
nojsElement.classList.remove('no-js');


toogleButtonElement.addEventListener('click', function () {
  toogleButtonElement.classList.toggle('main-header__toggle--closed');
  menuElement.classList.toggle('main-nav--opened');
})

// Скрипт для карты

ymaps.ready(init);
const geoObjects = [];
let MAP_COORDS_CENTER;
const marks = [
  {
    latitude: 59.938631,
    longitude: 30.323037,
    hintContent: '<div class="map__hint">ул. Большая Конюшенная, д. 19/8</div>'
  }
]
let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (mobile) {
  MAP_COORDS_CENTER = [59.938631, 30.323037];
} else {
  MAP_COORDS_CENTER = [59.938631, 30.3295]
};

// Создание карты.

function init() {
  const myMap = new ymaps.Map("map", {
    center: MAP_COORDS_CENTER,
    zoom: 14
  });


  // window.addEventListener('resize', function () {
  //   console.log('RESIZE');
  //   // myMap.container.fitToViewport([false])
  // })

  let imageSource;

  if(mobile) {
    imageSource = {
      src: '../img/icons/map-pin.png',
      size: [56, 52],
      offset: [-36, -52]
    }
  } else {
    imageSource = {
      src: '../img/icons/map-pin-desktop.png',
      size: [113, 106],
      offset: [-45, -40]
    }
  }

  marks.forEach(function (mark, i) {
    geoObjects.push(new ymaps.Placemark([mark.latitude, mark.longitude], {
      hintContent: mark.hintContent
    }, {
      iconLayout: 'default#image',
      iconImageHref: imageSource.src,
      iconImageSize: imageSource.size,
      iconImageOffset: imageSource.offset
    }))
  })

  const clusterer = new ymaps.Clusterer()

  myMap.geoObjects.add(clusterer)
  clusterer.add(geoObjects)
}

// Slider

const container = document.querySelector('.slider');
const sliderButton = document.querySelector('.slider__button');

document.querySelector('.slider__input').addEventListener('input', (e) => {
  container.style.setProperty('--position', `${e.target.value}%`);
});
