import zoomSound from './scripts/zoomSound'

const body = document.querySelector('body')

const Loaded = () => {
  if (body.classList.contains('viber')) {
    zoomSound({
      time: 2000,
      quant: 20,
      rotate: 180,
      pitch: 2
    })
  } else if (body.classList.contains('sliber')) {
    zoomSound({
      time: 8000,
      quant: 40,
      rotate: 360,
      pitch: 4
    })
  }
}

window.onload = Loaded()
