import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { Button } from "./components/ui/button"

function App() {

  return (
    <>
      <div>
        <Navbar />
        <div className="w-full py-50 text-9xl mt-16 text-center">Main Body</div>
        <Footer />
      </div>
    </>
  )
}

export default App
