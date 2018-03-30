import 'prismjs'
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import './common/icons.css'
import { render } from 'inferno'
import Debugger from './components/Debugger'

document.body.removeChild(document.querySelector('#error'))
render(<Debugger />, document.getElementById('root'))
