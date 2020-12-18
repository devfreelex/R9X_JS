import template from './template.js'
import styles from './styles.js'

const appNotFound = () => {

    const state = {
        title: 'Not Found Page!!!'
    }

    return {
        state,
        template,
        styles
    }
}

export default appNotFound