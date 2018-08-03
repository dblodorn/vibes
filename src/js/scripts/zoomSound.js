import { tween, easing, styler } from 'popmotion'
import { FMSynth, PingPongDelay } from  'tone'
import quantizeNumber from 'quantize-number'

export default () => {
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
    fm.triggerAttackRelease(quantizeNumber((val.rotate * 2), 20), '6n');
  }

  const updateCounter = (v) => audioVis(v);

  tween({
    from: 0,
    to: { rotate: 180, scale: 20 },
    duration: 5000,
    ease: easing.linear,
    flip: Infinity
  }).start(updateCounter)
}
