;(async function(){
  console.log('start')
  const size = 16
  const dotsNode = document.querySelector('.dots');

  const loop = (times, iterator) =>
    Array(times).fill().map((_,i)=>iterator(i))

  const createNode = className => {
    const node = document.createElement('div')
    node.classList.add(className)
    return node
  }

  const dots = loop(size, x => {
    const row = createNode('dots-row')
    dotsNode.appendChild(row)
    return loop(size, y => {
      const dot = createNode('dot')
      row.appendChild(dot)
      return dot
    })
  })

  const forEachDot = (iterator) =>
    loop(size, x => loop(size, y => iterator(x,y, dots[x][y])))

  console.log({ dots })

  forEachDot((x, y, dot) => {
    const scale = (x /size)
    console.log({x, y, dot}, scale)
    dot.style.transform = `scale(${scale})`
  })
})();
