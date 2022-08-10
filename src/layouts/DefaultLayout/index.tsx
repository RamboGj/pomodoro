import { Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import { LayoutContainer } from './styles'

export default function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
      {/* outlet fará com que os components colocados dentro DefaultLayout tenham seu espaço garantido pelo react router */}
    </LayoutContainer>
  )
}
