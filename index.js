;(async function(){
  console.log('start')
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
    `sin(t-sqrt((x-7.5)**2+(y-6)**2))`,
    `(Math.random() * 2) - 1`,
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


  const dots = Array(size).fill().map(() => Array(size).fill())
  const forEachDot = iterator =>
    Array(size * size).fill().map((_,i) => {
      const x = Math.floor(i / size)
      const y = i % size
      const dot = dots[y][x]
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
    dots[y][x] = dot
  })
  console.log({ dots })

  // const dots = loop(size, x => {
  //   const row = createNode('dots-row')
  //   dotsNode.appendChild(row)
  //   return loop(size, y => {
  //     const dot = createNode('dot')
  //     row.appendChild(dot)
  //     return dot
  //   })
  // })

  // const forEachDot = (iterator) =>
  //   loop(size, x => loop(size, y => iterator(x,y, dots[x][y])))

  // forEachDot((i, x, y) => {
  //   const dot = dots[y][x]
  //   const scale = (x /size)
  //   dot.style.transform = `scale(${scale})`
  // })

  function renderFrame(t){
    // console.log('RENDER! ', { t })
    forEachDot((i, x, y, dot) => {
      // debugNode.innerText = `t=${t}`; //` i=${i} x=${x} y=${y}`
      let scale = userInputAsFunction(t, i, x, y)
      if (scale > 1) scale = 1
      if (scale < -1) scale = -1
      const color = scale > 0 ? 'white' : scale < 0 ? 'red' : 'teal'
      dot.style.transform = `scale(${scale})`
      dot.style.backgroundColor = color
    })
  }

  window.renderCount = 0
  const interval = 10
  let now = Date.now()

  let animationFrameRequestId
  window.start = function(){
    const now = () => Date.now() / 1000 // <- lower this to speed up time
    const startTime = now();
    let lastT = -1
    const step = () => {
      const delta = now() - startTime;
      const t = Math.round(delta * 1000) / 1000
      if (t !== lastT) renderFrame(t);
      lastT = t
      animationFrameRequestId = requestAnimationFrame(step)
    }
    step()
  }

  window.stop = function(){
    cancelAnimationFrame(animationFrameRequestId);
  }

  start()

})();
