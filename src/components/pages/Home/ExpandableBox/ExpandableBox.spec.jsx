import '@testing-library/jest-dom'
import { act, fireEvent, screen } from '@testing-library/react'
import React from 'react'

import { renderWithStyles } from 'utils/testHelpers'

import ExpandableBox from './ExpandableBox'

const renderExpandableBox = async (props, children) => {
  return await act(async () => {
    const component = (
      <ExpandableBox {...props}>
        {children}
      </ExpandableBox>
    )
    await renderWithStyles(component, {
      componentStylesheet: 'components/pages/Home/ExpandableBox/ExpandableBox.scss',
    })
  })
}

describe('component: ExpandableBox', () => {
  describe('render', () => {
    let props
    let children

    beforeEach(async () => {
      props = {
        tabIndex: 0,
        title: 'Awesome Title !!!',
      }
      children = (
        <div>
          {'Hello world'}
        </div>
      )
      await renderExpandableBox(props, children)
    })

    it('should display title', () => {
      expect(screen.getByText(props.title)).toBeInTheDocument()
    })

    it('should not display children', () => {
      expect(screen.getByText('Hello world')).not.toBeVisible()
    })

    describe('when title is click', () => {
      beforeEach(async () => {
        await fireEvent.click(screen.getByText(props.title))
      })

      it('should display title and children', () => {
        expect(screen.getByText(props.title)).toBeInTheDocument()
        expect(screen.getByText('Hello world')).toBeVisible()
      })
    })
  })
})
