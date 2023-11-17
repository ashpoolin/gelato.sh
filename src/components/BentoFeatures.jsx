import { motion } from 'framer-motion';
import { Flame, Star, Circle, ShieldCheck } from "lucide-react";

function BentoFeatures() {
  return (
                      <div className="grid grid-cols-5 gap-10 max-w-3xl mx-auto py-24">
                            <motion.div 
                                className="col-span-3 bg-white/5 flex flex-col p-8 h-[300px] rounded-[50px] hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                                    <Flame className="h-[50px] w-[50px] fill-white text-white p-2 rounded-full bg-white/10 mt-[5px] ring-1 ring-white/20" />
                                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Name</h3>
                                    <p className="text-lg font-normal mt-2 text-white/50">this is some text in a box.</p>
                            </motion.div>
                            <motion.div 
                                className="col-span-2 bg-white/5 flex flex-col p-8 h-[300px] rounded-[50px] hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                                    <Star className="h-[50px] w-[50px] fill-white text-white p-2 rounded-full bg-white/10 mt-[5px] ring-1 ring-white/20" />
                                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Name</h3>
                                    <p className="text-lg font-normal mt-2 text-white/50">this is some text in a box.</p>
                            </motion.div>

                            <motion.div 
                                className="col-span-2 bg-white/5 flex flex-col p-8 h-[300px] rounded-[50px] hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                                    <ShieldCheck className="h-[50px] w-[50px] fill-white text-white p-2 rounded-full bg-white/10 mt-[5px] ring-1 ring-white/20" />
                                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Name</h3>
                                    <p className="text-lg font-normal mt-2 text-white/50">this is some text in a box.</p>                                
                            </motion.div>
                            <motion.div 
                                className="col-span-3 bg-white/5 flex flex-col p-8 h-[300px] rounded-[50px] hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                                    <Circle className="h-[50px] w-[50px] fill-white text-white p-2 rounded-full bg-white/10 mt-[5px] ring-1 ring-white/20" />
                                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Name</h3>
                                    <p className="text-lg font-normal mt-2 text-white/50">this is some text in a box.</p>                                   
                            </motion.div>

                        </div>

  );
}

export default BentoFeatures;