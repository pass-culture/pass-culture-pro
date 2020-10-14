import sass from 'node-sass'
import omit from 'lodash.omit'
import { render } from '@testing-library/react'

export function renderWithStyles(ui, options = {}) {
  const view = render(ui, {
    ...omit(options, 'stylesheet'),
  })
  if (options.stylesheet) {
    const stylesData = `
    @import 'src/styles/variables/index.scss';
    @import 'src/styles/${options.stylesheet}';
    `
    const styles = sass.renderSync({ data: stylesData })

    const styleElement = document.createElement('style')
    styleElement.innerHTML = styles.css.toString()
    document.body.appendChild(styleElement)
    document.body.appendChild(view.container)
  }

  return view
}
