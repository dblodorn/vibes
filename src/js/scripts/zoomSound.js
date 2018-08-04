import { tween, easing, styler } from 'popmotion'
import { FMSynth, PingPongDelay } from  'tone'
import quantizeNumber from 'quantize-number'

export default (config) => {
  const ball = document.querySelector('#ball')
  const ballStyler = styler(ball)

  var feedbackDelay = new PingPongDelay({
    'delayTime': "8n",
    'feedback': 0.86,
    'wet': 0.75
  }).toMaster()
  const fm = new FMSynth().toMaster().connect(feedbackDelay)

  const audioVis = (val) => {
    ballStyler.set(val)
    fm.triggerAttackRelease(quantizeNumber((val.rotate * config.pitch), config.quant), '6n');
  }

  const updateCounter = (v) => audioVis(v);

  tween({
    from: 0,
    to: { rotate: config.rotate, scale: 20 },
    duration: config.time,
    ease: easing.linear,
    flip: Infinity
  }).start(updateCounter)
}
