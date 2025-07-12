import "./index.css";
import Canvas from "./canvas";
import data from "./data";
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);


function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const headingRef = useRef(null);
  const growingSpan = useRef(null);
  const cursorref = useRef(null);
  const mainref = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const locomotiveScroll = new LocomotiveScroll({
      el: scrollContainerRef.current,
      smooth: true,
      lerp: 0.1,
      multiplier: 1,
      horizontal: false,
      horizontalGesture: false,
    });

    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
    };
  }, [showCanvas]);



  useGSAP(() => {
    if (!mainref.current || !cursorref.current) return;

  
    const handleMouseMove = (event) => {
      gsap.to(cursorref.current, {
        x: event.clientX - 16,
        y: event.clientY - 16,
        duration: 0.6,
        ease: "power2.out"
      });
    };
  
    mainref.current.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      if (mainref.current) {
        mainref.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, {scope: mainref});
  
useEffect(() => {
  const handleClick = (e) => {
    setShowCanvas(prevShowCanvas => {
      if(!prevShowCanvas){
        console.log(prevShowCanvas);
        
        gsap.set(growingSpan.current, {
          x: e.clientX,
          y: e.clientY,
        });

        gsap.to("body", {
          color: "black",
          backgroundColor: "#FD2C2A",
          duration: 1,
          ease: "power2.inOut",
        });

        gsap.to(growingSpan.current, {
          scale: 1000,
          duration: 1.2,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(growingSpan.current, {
              scale: 0,
              clearProps: "all"
            });
          }
        });
      }
      else {
        gsap.to("body", {
          backgroundColor: "black",
          color: "white",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
      return !prevShowCanvas;
    });
  }

  const headingElement = headingRef.current;
  if (headingElement) {
    headingElement.addEventListener("click", handleClick);
    return () => headingElement.removeEventListener("click", handleClick);
  }
}, []);

  return (
    <>
    <span ref={growingSpan} className="w-10 h-10 top-[-50px] left-[-50px] rounded-full fixed"></span>
    <div ref={cursorref} className="cursor h-8 w-8 bg-white rounded-full fixed"></div>
    <div ref={mainref} className="h-screen w-screen">
      <div ref={scrollContainerRef} data-scroll-container className="w-full relative font-[helvetica_now_display]">
        <div data-scroll-section className="w-full">
          {showCanvas && data[0].map((canvasdets, index) => (
            <Canvas details={canvasdets} />
          ))}
          <div className="min-h-screen">
            <nav className="top-0 left-0 w-full p-5 flex justify-between items-center">
              <div className="text-2xl font-regular">
                thirtysixstudio
              </div>
              <div className="flex gap-12 pr-[15%]">
                <a href="#" className="text-2xl gap-10 hover:text-gray-300 transition-colors">Home</a>
                <a href="#" className="text-2xl gap-10 hover:text-gray-300 transition-colors">About</a>
                <a href="#" className="text-2xl gap-10 hover:text-gray-300 transition-colors">Work</a>
                <a href="#" className="text-2xl gap-10 hover:text-gray-300 transition-colors">Contact</a>
              </div>
            </nav>
            <div className="textcontainer w-full px-[25%] pt-[3%] relative z-[1]">
            <div className=" text w-[45%]">
              <h1 className="text-5xl">At Thirtysixstudio, we build immersive digital experiences for brands with a purpose.</h1>
              <p className="text-xl pt-[8%]">We're a boutique production studio focused on design, motion, and creative technology, constantly reimagining what digital craft can do for present-time ads and campaigns.</p>
              <p className="text-2xl pt-[8%]">Scroll</p>
              </div>
            </div>
            <h1 ref={headingRef} className="text-[21.5rem] pl-[1.5%] mt-[13%] mb-[6%] relative z-[1]">Thirtysixstudio</h1>
          </div>
          
          {/* About section below Thirtysixstudio text */}
          <div className="w-full pl-20 relative">
            {showCanvas && data[1].map((canvasdets, index) => (
              <Canvas details={canvasdets} />
            ))}
            <section className="flex space-evenly p-[3%]">
              <div>
                <h1 className="text-8xl font-medium pt-[4%] z-[1]">About the brand</h1>
                <p className="text-5xl pt-[5%] w-[60%] z-[1]">We're a boutique production studio focused on design, motion, and creative technology, constantly reimagining what digital craft can do for present-time ads and campaigns.</p>
              </div>          
                <img src="https://images.pexels.com/photos/29940157/pexels-photo-29940157/free-photo-of-digital-artist-using-graphic-tablet-with-stylus.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="about" className=" self-start w-[50%] pt-[3%]"/>
              </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
