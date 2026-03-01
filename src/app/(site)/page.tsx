import Aboutus from "./sections/Aboutus";
import Program from "./sections/Program";
import Tools from "./sections/Tools";
import Gallery from "./sections/Gallery";
import Partners from "./sections/Partners";
import Contact from "./sections/Contact";
import HeroSlideshow from "../components/HeroSlideshow";
import SiteFooter from "../components/SiteFooter";
import SnowfallClient from "../components/SnowFallClient";
export const dynamic = "force-dynamic";
import TextTypeClient from "../components/TextTypeClient";
export default function Home() {
  // for snowfall on web add " <SnowfallClient />" up to "<HeroSlideshow />"


  return (
    <>
    <div className="mx-auto max-w-6xl px-6 pt-6">
  <div className="mb-4 text-center">
    <TextTypeClient />
  </div>
     
      <HeroSlideshow />
      </div>
      <Aboutus />
      <Program />
      <Tools />
      <Gallery />
      <Partners />
      <Contact />
      <SiteFooter />
    </>
  );
}
