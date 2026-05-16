import { heroStyles } from "../assets/dummyStyles"
import Navbar from "../components/Navbar"


const Hero = () => {
  return (
    <div className={heroStyles.container}>
        <Navbar />
    </div>
  )
}

export default Hero