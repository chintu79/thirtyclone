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
  const scrollTitleRef = useRef(null);

  // Initialize Locomotive Scroll once
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
  }, []);

  // Custom cursor follow mouse with smooth animation
  useGSAP(() => {
    if (!mainref.current || !cursorref.current) return;

    const handleMouseMove = (event) => {
      gsap.to(cursorref.current, {
        x: event.clientX - cursorref.current.offsetWidth / 2,
        y: event.clientY - cursorref.current.offsetHeight / 2,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursorref.current, { scale: 1.5, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursorref.current, { scale: 1, duration: 0.3 });
    };
  
    mainref.current.addEventListener("mousemove", handleMouseMove);
    mainref.current.addEventListener("mouseenter", handleMouseEnter);
    mainref.current.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      if (mainref.current) {
        mainref.current.removeEventListener("mousemove", handleMouseMove);
        mainref.current.removeEventListener("mouseenter", handleMouseEnter);
        mainref.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, {scope: mainref, dependencies: []});

  // Horizontal scroll title animation
  useGSAP(() => {
    if (!scrollTitleRef.current) return;
    
    const scrollTitle = scrollTitleRef.current;
    const totalWidth = scrollTitle.scrollWidth;
    
    gsap.to(scrollTitle, {
      x: -totalWidth + window.innerWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
  }, {scope: scrollTitleRef, dependencies: []});
  
  // Handle click on heading to toggle canvas
  useEffect(() => {
    const headingElement = headingRef.current;
    if (!headingElement) return;

    const handleClick = (e) => {
      setShowCanvas(prevShowCanvas => {
        if(!prevShowCanvas){
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
            backgroundColor: "#0a0a0a",
            color: "white",
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
        return !prevShowCanvas;
      });
    };

    headingElement.addEventListener("click", handleClick);
    return () => headingElement.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
    <span ref={growingSpan} className="grow fixed top-[-50px] left-[-50px] rounded-full"></span>
    <div ref={cursorref} className="cursor"></div>
    <div ref={mainref} className="selection:bg-[#FD2C2A] selection:text-black min-h-screen w-screen relative">
      <div ref={scrollContainerRef} data-scroll-container className="w-full relative">
        <div data-scroll-section className="w-full">
          {showCanvas && data[0].map((canvasdets) => (
            <Canvas key={canvasdets.startIndex} details={canvasdets} />
          ))}
          
          {/* Hero Section */}
          <div className="min-h-screen relative flex flex-col justify-between">
            <nav className="fixed top-0 left-0 w-full px-[1%] py-6 flex justify-between items-center z-50">
              <div className="text-xl font-semibold tracking-wide">
                thirtysixstudio
              </div>
              <nav className="flex justify-center items-center pr-[1.5%] gap-[30px] text-sm font-medium">
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">Home</a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">About</a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">Work</a>
                <a href="#" className="hover:text-gray-400 transition-colors duration-300">Contact</a>
              </nav>
            </nav>

            {/* Hero Text */}
            <div className="w-full px-[5%] pt-[15%] pb-[11%] relative z-[1]">
              <div className="w-[50%]">
                <h1 className="text-4xl md:text-5xl leading-tight font-semibold mb-8">At Thirtysixstudio, we build immersive digital experiences for brands with a purpose.</h1>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">We&apos;re a boutique production studio focused on design, motion, and creative technology, constantly reimagining what digital craft can do for present-time ads and campaigns.</p>
                <p className="text-xl font-medium tracking-wider">↓ Scroll</p>
              </div>
            </div>

            {/* Large Heading */}
            <div className="relative">
              <h1 ref={headingRef} className="text-[13vw] font-bold leading-none px-[1%] pb-[6%] relative z-[1] cursor-pointer hover:opacity-80 transition-opacity">Thirtysixstudio</h1>
            </div>
          </div>

          {/* Horizontal Scrolling Title */}
          <div className="w-full overflow-hidden bg-black pb-4 relative z-0">
            <div ref={scrollTitleRef} className="scroll-title flex whitespace-nowrap">
              <span>FOR ALL THINGS DIGITAL PRODUCTION — </span>
              <span>FOR ALL THINGS DIGITAL PRODUCTION — </span>
              <span>FOR ALL THINGS DIGITAL PRODUCTION — </span>
              <span>FOR ALL THINGS DIGITAL PRODUCTION — </span>
            </div>
          </div>

          {/* What We Do Section */}
          <div data-scroll-section className="min-h-screen flex flex-col justify-center px-[5%] py-10 relative">
            {showCanvas && data[1].map((canvasdets) => (
              <Canvas key={canvasdets.startIndex} details={canvasdets} />
            ))}
            <div className="max-w-6xl">
              <p className="text-sm font-medium tracking-widest text-gray-400 mb-4">01 WHAT WE DO</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight">We aim to elevate digital production in the advertising space, bringing your ideas to life.</h2>
              
              <p className="text-lg leading-relaxed text-gray-300 mb-12 max-w-4xl">
                We provide you with captivating design, interactive animations, reliable code, and immaculate project coordination. Whether you need a campaign built from scratch or assistance at a specific phase, we&apos;ve got you covered.
              </p>

              <div className="grid grid-cols-2 gap-12 mt-16">
                <div>
                  <h3 className="text-lg font-semibold mb-4 tracking-wide">Our Services</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>Creative Direction</li>
                    <li>Design & Animation</li>
                    <li>Technology & Development</li>
                    <li>Project Management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 tracking-wide">What Sets Us Apart</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>Boutique expertise</li>
                    <li>Cutting-edge technology</li>
                    <li>Agile approach</li>
                    <li>Passionate team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div data-scroll-section className="min-h-screen flex items-center px-[5%] py-20 relative">
            <div className="max-w-6xl w-full grid grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-sm font-medium tracking-widest text-gray-400 mb-4">02 WHO WE ARE</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Our vision is to refine digital production while creating social impact and opportunity.</h2>
                
                <div className="space-y-12 mt-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 tracking-wide">Agile</h3>
                    <p className="text-gray-400 leading-relaxed">We live and breathe efficiency and are not limited by geography. We curate the right team for each project and get moving swiftly.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 tracking-wide">Innovative</h3>
                    <p className="text-gray-400 leading-relaxed">We use carefully crafted digital processes and new technology to ensure our initiatives run smoothly.</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 tracking-wide">Cultured</h3>
                    <p className="text-gray-400 leading-relaxed">We are progressive and community-focused and don&apos;t believe in maintaining the status quo.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <img 
                  src="https://images.pexels.com/photos/29940157/pexels-photo-29940157/free-photo-of-digital-artist-using-graphic-tablet-with-stylus.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="about" 
                  className="w-[90%] h-auto rounded-[15px] object-cover shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div data-scroll-section className="min-h-screen flex flex-col items-center justify-center px-[5%] py-20 relative bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-4xl text-center">
              <p className="text-sm font-medium tracking-widest text-gray-400 mb-8">03 READY TO CREATE?</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Let&apos;s bring your vision to life.</h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Got a project in mind? Drop us a line and let&apos;s start the conversation.
              </p>
              <button className="px-[1rem] py-[0.7rem] rounded-[4px] bg-white text-black font-semibold tracking-wider hover:bg-gray-200 hover:text-black transition-all duration-300">
                GET IN TOUCH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
