const buttonStart = document.querySelector('.landing svg')
const globalHtml = {
  landing: document.querySelector('.landing'),
  clock: document.querySelector('.clock'),
  resting: document.querySelector('.resting')
}

const globalState = {
  stage: 1
}

const animations = {
  up: element => {
    const keyframes = [{ opacity: 0 }, { opacity: 1 }]
    const config = {
      duration: 1000
    }

    element.animate(keyframes, config)
  },
  down: element => {
    const keyframes = [{ opacity: 1 }, { opacity: 0 }]
    const config = {
      duration: 700,
      easing: 'ease-in-out'
    }

    const timeToAnimationEnd = config.duration

    return new Promise(resolve => {
      element.animate(keyframes, config)

      setTimeout(() => resolve(), timeToAnimationEnd)
    })
  },
  toDown: element => {
    const keyframes = [
      { transform: 'translateY(0vh)', opacity: 1 },
      { transform: 'translateY(-10vh)', opacity: 0.5 },
      { transform: 'translateY(100vh)', opacity: 0 }
    ]
    const config = {
      duration: 700,
      easing: 'ease-in-out',
      delay: 700
    }

    const timeToAnimationEnd = config.duration + config.delay * 0.6

    return new Promise(resolve => {
      element.animate(keyframes, config)

      setTimeout(() => resolve(), timeToAnimationEnd)
    })
  }
}

function workingState() {
  const html = {
    progressBar: document.querySelector('.clock-progress'),
    pointer: document.querySelector('.clock-pointer'),
    timingView: document.querySelector('.clock .timing'),
    stageIndicator: document.querySelector('.clock h2 .stage')
  }

  const progressBarRadius = html.progressBar.attributes.r.value
  const progressBarCircumference = Math.PI * 2 * progressBarRadius

  html.stageIndicator.innerText = globalState.stage
  html.progressBar.style.strokeDasharray = progressBarCircumference

  globalHtml.landing.style.display = 'none'
  globalHtml.clock.style.display = 'initial'

  animations.up(globalHtml.clock)

  const initialValues = {
    timing: 25 * 60
  }

  const state = {
    intervalID: 0,
    timing: initialValues.timing
  }

  function updateProgressBarAngle() {
    const timePercent = state.timing / initialValues.timing
    const pointerRotationAngle = timePercent * 360 * -1

    html.progressBar.style.strokeDashoffset =
      -progressBarCircumference + progressBarCircumference * timePercent

    html.pointer.style.transform = `rotate(${pointerRotationAngle}deg)`
  }

  function updateTime() {
    const minutes = Math.floor(state.timing / 60)
    const seconds = Math.round(((state.timing / 60) % 1) * 60)

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

    html.timingView.innerText = `${formattedMinutes}:${formattedSeconds}`
  }

  function start() {
    state.intervalID = setInterval(() => {
      state.timing -= 1

      updateProgressBarAngle()
      updateTime()

      if (state.timing == 0) next()
    }, 1000)
  }

  function next() {
    clearInterval(state.intervalID)

    state.timing = initialValues.timing
    html.timingView.innerText = '25:00'

    setTimeout(
      () =>
        (html.progressBar.style.strokeDashoffset = progressBarCircumference),
      1000
    )
    setTimeout(() => restingState(), 1500)
  }

  start()

  window.addEventListener('keypress', ({ key }) => {
    if (key === '1') state.timing = 2
  })
}

async function restingState() {
  const html = {
    stage: document.querySelector('.resting h2 .stage'),
    timingView: document.querySelector('.resting .timing')
  }

  html.stage.innerText = globalState.stage

  await animations.toDown(globalHtml.clock)

  globalHtml.resting.style.display = 'flex'
  globalHtml.clock.style.display = 'none'

  animations.up(globalHtml.resting)

  const initialValues = {
    timing: 5 * 60
  }

  const state = {
    intervalID: 0,
    timing: initialValues.timing
  }

  function updateTime() {
    const minutes = Math.floor(state.timing / 60)
    const seconds = Math.round(((state.timing / 60) % 1) * 60)

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

    html.timingView.innerText = `${formattedMinutes}:${formattedSeconds}`
  }

  function start() {
    state.intervalID = setInterval(() => {
      state.timing -= 1

      if (state.timing == 0) return next()

      updateTime()
    }, 1000)
  }

  async function next() {
    state.timing = initialValues.timing

    clearInterval(state.intervalID)

    globalState.stage += 1

    await animations.down(globalHtml.resting)

    globalHtml.resting.style.display = 'none'
    html.timingView.innerText = '05:00'

    workingState()
  }

  start()

  window.addEventListener('keypress', ({ key }) => {
    if (key === '2') state.timing = 2
  })
}

buttonStart.addEventListener('click', workingState)
