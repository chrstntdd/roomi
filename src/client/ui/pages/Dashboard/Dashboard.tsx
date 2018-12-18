import React from 'react'

import { Reveal, LazyBackgroundImage } from '@/ui/components/LazyImage'
import ElmComponent from '@/ui/components/ElmComponent'

import { Elm } from '@/Main.elm'

import * as styles from '@/ui/components/shared.scss'

function Dashboard() {
  return (
    <div className="dashboard">
      {Array(20)
        .fill(0)
        .map((_, index) => {
          return (
            // <Reveal key={index} once onReveal={() => console.log('REVEALED', index)}>
            //   <div className={styles.fakeBlock} >CONTENT</div>
            // </Reveal>
            <LazyBackgroundImage
              key={index}
              src="https://images.unsplash.com/photo-1544760110-fd7d2f7e93c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80"
            >
              <div style={{ height: '8rem', width: '12rem' }} />
            </LazyBackgroundImage>
          )
        })}
      <ElmComponent src={Elm.Main} flags={true} />
    </div>
  )
}

export default Dashboard
