import { Outlet } from "react-router-dom"
import NavBar from "../NavBar"

const HomeLayout = () => {
  return (
    <div className="">
      <NavBar/>
      <Outlet/>
    </div>
  )
}

export default HomeLayout