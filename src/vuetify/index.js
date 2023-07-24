import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#03A9F4',
          'primary-darken-1': '#039BE5',
          secondary: '#03DAC6',
          'secondary-darken-1': '#018786',
          error: '#B00020',
          warning: '#FB8C00',
          info: '#2196F3',
          success: '#4CAF50'
        },
        variables: {
          'activated-opacity': '0.00'
        }
      }
    }
  }
})
