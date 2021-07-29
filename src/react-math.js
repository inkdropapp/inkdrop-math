'use babel'
import * as React from 'react'
import PropTypes from 'prop-types'
import TeX from '@matejmazur/react-katex'

export default class Math extends React.Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.string)
  }

  render() {
    const lang = this.props.lang
    const equation = this.props.children[0]
    if (equation) {
      try {
        return (
          <TeX
            block={lang === 'math'}
            math={equation}
            renderError={(error) => {
              return (
                <span className="ui error message mde-error-message">
                  {error.message}
                </span>
              )
            }}
          />
        )
      } catch (e) {
        return <span>{e.message}</span>
      }
    } else {
      return <span>Invalid math block</span>
    }
  }
}
