// 

import React, { useState } from 'react';
//import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from "react-router-dom";

export default function DynamicNav() {
  const [showNav, setShowNav] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    if (latest > previous && latest > 150) {
      setHidden(true);
      setShowNav(false);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      className={`fixed inset-0 top-4 w-[95%] sm:w-[95%] mx-auto bg-white/10 font-medium text-slate-50 flex max-sm:justify-between gap-4 px-3 max-w-7xl items-center rounded-full font-mono h-14 p-5 overflow-hidden z-5`}
      variants={{
        long: { maxWidth: 777 },
        short: { maxWidth: 200 },
        hideNav: {
          height: 56,
          borderRadius: 50,
          alignItems: 'center',
          transition: { delay: 0, duration: 0.3 },
        },
        showNav: {
          height: 200,
          borderRadius: 22,
          alignItems: 'start',
          transition: { delay: 0 },
        },
      }}
      initial={'short'}
      animate={[hidden ? 'short' : 'long', showNav ? 'showNav' : 'hideNav']}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 14,
      }}
    >
        <div className="rounded-full flex items-center justify-center space-x-2">
            <img src={'/gelato-logo.png'} alt="logo" width={40} height={40} />
            <p className="text-white font-bold text-xl">Gelato</p>
        </div>
      
      <motion.ul
        className={`w-full ${
          showNav
            ? '[--display-from:none] [--display-to:flex]'
            : 'max-sm:[--display-from:none] sm:[--display-to:flex]'
        }  [--opacity-from:0.1] [--opacity-to:1] flex-col sm:flex-row items-center justify-center gap-10 max-sm:gap-5 max-sm:pt-10`}
        variants={{
          hidden: {
            display: 'var(--display-from, none)',
            opacity: 'var(--opacity-from, 1)',
            transition: { duration: 0.6, delay: 0 },
          },
          visible: {
            display: 'var(--display-to, none)',
            opacity: 'var(--opacity-to, 1)',
            transition: { duration: 0.6, delay: 0 },
          },
        }}
        initial={'hidden'}
        animate={[
          hidden && !showNav ? 'hidden' : 'visible',
          showNav ? 'visible' : '',
        ]}
      >
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Home</Link>
        <Link to="/sol" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">SOL</Link>
        <Link to="/stake" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Stake</Link>
        <Link to="/wallets" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Wallets</Link>
        <Link to="/research" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Research</Link>
        <Link to="/about" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">About</Link>
      </div>
      </motion.ul>
{/* 
      <motion.div
        className="w-full [--display-from:none][--display-to:inline-block] "
        variants={{
          hidden: {
            display: 'var(--display-from, none)',
            transition: { delay: 0, duration: 0.3 },
          },
          visible: {
            display: 'var(--display-to)',
            transition: { delay: 0.2, duration: 0.3 },
          },
        }}
        initial="hidden"
        animate={hidden ? 'visible' : 'hidden'}
      >
        <div className="w-full text-center">
            <p className="text-white font-bold text-2xl">Gelato</p>
        </div>
      </motion.div> */}

      <div
        className="rounded-full min-w-[40px] sm:hidden ghost"
        onClick={() => {
          setHidden(false);
          setShowNav((prev) => !prev);
        }}
      >
        {showNav ? <ChevronUp /> : <ChevronDown />}
      </div>
    </motion.nav>
  );
}