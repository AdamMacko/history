import Aboutus from "./sections/Aboutus";
import Program from "./sections/Program";
import Tools from "./sections/Tools";
import Gallery from "./sections/Gallery";
import Partners from "./sections/Partners";
import Contact from "./sections/Contact";
import HeroSlideshow from "../components/HeroSlideshow";
import SiteFooter from "../components/SiteFooter";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeroSlideshow />
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
