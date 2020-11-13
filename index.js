;(async function(){
  console.log('start')
  const size = 16
  const dotsNode = document.querySelector('.dots');
  const inputNode = document.getElementById('input');

  if (localStorage.input) inputNode.value = localStorage.input

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

  forEachDot((i, x, y) => {
    const dot = dots[y][x]
    const scale = (x /size)
    dot.style.transform = `scale(${scale})`
  })

  let userInputAsFunction
  function parseUserInput(){
    const code = inputNode.value
    console.log(`input="${code}"`)
    localStorage.input = code
    try{
      const newUserInputAsFunction = new Function('t', 'i', 'x', 'y', `return ${code}`)
      newUserInputAsFunction(0,0,0,0)
      userInputAsFunction = newUserInputAsFunction
      inputNode.style.color = 'white'
    }catch(e){
      inputNode.style.color = 'red'
      console.log('user input is invalid');
    }
  }
  parseUserInput()
  inputNode.addEventListener('keyup', parseUserInput)
  inputNode.addEventListener('change', parseUserInput)

  function renderFrame(t){
    // console.log('RENDER! '+userInputAsFunction)

    forEachDot((i, x, y, dot) => {
      let scale = userInputAsFunction(t, i, x, y)
      if (scale > 1) scale = 1
      if (scale < -1) scale = -1
      // console.log({ scale, t, i, x, y })
      // const scale = (x /size)
      const color = scale > 0 ? 'white' : scale < 0 ? 'red' : 'teal'
      dot.style.transform = `scale(${scale})`
      dot.style.backgroundColor = color
    })
    // requestAnimationFrame(renderFrame)
  }

  window.renderCount = 0
  const interval = 10
  let now = Date.now()
  let timeout = setInterval(
    () => {
      const then = now
      now = Date.now()
      const delta = now - then
      const thisSecond = Math.floor(now / interval)
      const t = thisSecond % (size*size)
      window.renderCount++
      requestAnimationFrame(() => { renderFrame(t) })
    },
    interval
  )
  renderFrame(0)

  window.stop = function(){
    clearTimeout(timeout);
  }

  // function refresh(){

  // }



})();
