
;(async function(){

  const size = 16

  const EXAMPLES = [
    `Math.sin(y/8+t)`,
    `[1, 0, -1][i%3]`,
    `Math.random() < 0.1`,
    `Math.random()`,
    `Math.sin(t)`,
    `i / 256`,
    `x / 16`,
    `y / 16`,
    `y - t*4`,
    `y - t`,
    `y - x`,
    `sin(t-sqrt((x-7.5)**2+(y-6)**2))`,
    `(Math.random() * 2) - 1`,
    `(y > x) && (14-x < y)`,
    `i%4 - y%4`,
    `x%4 && y%4`,
    `x>3 & y>3 & x<12 & y<12`,
    `-(x>t & y>t & x<15-t & y<15-t)`,
    `(y-6) * (x-6)`,
    `(y-4*t|0) * (x-2-t|0)`,
    `4 * t & i & x & y`,
    `(t*10) & (1<<x) && y==8`,
    `sin(i ** 2)`,
    `cos(t + i + x * y)`,
    `sin(x/2) - sin(x-t) - y+6`,
    `(x-8)*(y-8) - sin(t)*64`,
    ``,
  ]

  const debugNode = document.querySelector('.debug');
  const dotsNode = document.querySelector('.dots');
  const inputNode = document.getElementById('input');
  const randomExample = () => EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]

  let userInputAsFunction
  function parseUserInput(){
    const code = inputNode.value.trim()
    localStorage.input = code
    if (userInputAsFunction && userInputAsFunction.code === code) return;
    try{
      const newUserInputAsFunction = new Function('t', 'i', 'x', 'y', `with(Math){ return ${code} }`)
      newUserInputAsFunction.code = code
      newUserInputAsFunction(0,0,0,0)
      userInputAsFunction = newUserInputAsFunction
      inputNode.style.color = 'white'
    }catch(error){
      inputNode.style.color = 'red'
    }
    inputNode.focus()
  }
  parseUserInput()
  inputNode.addEventListener('keyup', parseUserInput)
  inputNode.addEventListener('change', parseUserInput)
  inputNode.form.addEventListener('submit', event => {
    event.preventDefault()
    if (!userInputAsFunction) return
    history.pushState('', null, `/?code=${encodeURIComponent(userInputAsFunction.code)}`)
  })

  const getCodeFromLocation = () =>
    window.location.search.match(/code=([^&]+)/) && decodeURIComponent(RegExp.$1)

  window.addEventListener('popstate', () => {
    const value = getCodeFromLocation()
    if (value){
      inputNode.value = value
      parseUserInput()
    }
  })

  inputNode.value = getCodeFromLocation() || localStorage.input || randomExample()
  parseUserInput()

  dotsNode.addEventListener('click', () => {
    let value
    do { value = randomExample() } while (inputNode.value === value)
    inputNode.value = value
    parseUserInput()
  })

  document.addEventListener('keydown', event => {
    // TODO if full screen keydombo
    // dotsNode.parentNode.requestFullscreen()
  })

  // const dots = Array(size).fill().map(() => Array(size).fill())
  const dots = []
  const forEachDot = iterator =>
    Array(size * size).fill().map((_,i) => {
      const x = Math.floor(i / size)
      const y = i % size
      const dot = dots[i]
      return iterator(i, x, y, dot)
    })

  const createNode = className => {
    const node = document.createElement('div')
    node.classList.add(className)
    return node
  }

  const rows = []
  forEachDot((i,x,y) => {
    let row = rows[y]
    if (!row){
      row = createNode('dots-row')
      rows[y] = row
      dotsNode.appendChild(row)
    }
    const dot = createNode('dot')
    row.appendChild(dot)
    dots[i] = dot
  })

  function renderFrame(t){
    const newStyles = []
    forEachDot((i, x, y, dot) => {
      let scale = userInputAsFunction(t, i, x, y)
      if (scale === true || scale > 1) scale = 1
      else if (scale === false) scale = 0
      else if (scale < -1) scale = -1
      const color = (
        scale > 0 ? 'var(--color-white)' :
        scale < 0 ? 'var(--color-red)' :
        'transparent'
      )
      newStyles[i] = [scale, color];
    })
    requestAnimationFrame(() => {
      newStyles.forEach(([scale, color], i) => {
        const dot = dots[i]
        dot.style.transform = `scale(${scale})`
        dot.style.backgroundColor = color
      })
    })
  }

  window.renderCount = 0
  const interval = 10
  let now = Date.now()

  let timeoutId
  window.start = function(){
    const now = () => Date.now() / 1000 // <- lower this to speed up time
    const startTime = now();
    const step = () => {
      const delta = now() - startTime;
      const t = Math.round(delta * 1000) / 1000
      renderFrame(t);
      timeoutId = setTimeout(step, 0)
    }
    step()
  }

  window.stop = function(){
    clearTimeout(timeoutId);
  }

  start()





})();
