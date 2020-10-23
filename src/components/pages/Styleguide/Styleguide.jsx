import React from 'react'

import Main from 'components/layout/Main'
import Titles from 'components/layout/Titles/Titles'

import StyleguideAgenda from './StyleguideAgenda'
import StyleguideButtons from './StyleguideElements/StyleguideButtons'
import StyleguideInputText from './StyleguideElements/StyleguideInputText'
import StyleguideSelect from './StyleguideElements/StyleguideSelect'
import StyleguideTitles from './StyleguideElements/StyleguideTitles'
import StyleguideTitle from './StyleguideTitles'

const Styleguide = () => (
  <Main name="styleguide">
    <Titles title="Styleguide" />
    <StyleguideAgenda />

    <StyleguideTitle
      className="sg-titles"
      componentName="Titres"
    />
    <StyleguideTitles />

    <StyleguideTitle
      className="sg-buttons"
      componentName="Boutons"
    />
    <StyleguideButtons />

    <StyleguideTitle
      className="sg-inputtext"
      componentName="Inputs"
    />
    <StyleguideInputText />

    <StyleguideTitle
      className="sg-select"
      componentName="Select"
    />
    <StyleguideSelect />
  </Main>
)

export default Styleguide
