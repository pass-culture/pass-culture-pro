import React from 'react'
import { RedocStandalone } from 'redoc'
import openApi3 from './openApi3'

const ApiDocumentation = () => (
  <RedocStandalone
    options={{
      nativeScrollbars: true,
      theme: {
        colors:
        { primary:
          { main: '#EB0055' }
        }
      }
    }}
    spec={openApi3[0]}
  />
)

export default ApiDocumentation
