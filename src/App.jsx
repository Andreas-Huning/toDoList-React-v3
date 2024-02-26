import './App.css'
import { connect } from 'react-redux'
import mapDispatchToProps from './redux/mapDispatchToProps'
import mapStateToProps from './redux/mapDispatchToProps'

import Main from './components/Main'

function App(props) {

  return (
    <>
    <Main />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps) (App)
