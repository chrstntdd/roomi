import React from 'react'

interface Props {
  src: any
  flags?: any
  ports?: (a: any) => void
}

export const ElmComponent = React.memo(({ src, flags, ports }: Props) => {
  const el = React.useRef(null)

  React.useEffect(() => {
    const app = src.init({ node: el.current, flags })

    if (app && typeof ports !== 'undefined') ports(app.ports)
  }, [])

  return <div ref={el} />
})

export default ElmComponent
