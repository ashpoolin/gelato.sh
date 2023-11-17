import { motion } from 'framer-motion';

function BentoFeatures() {
  return (
                      <div className="grid grid-cols-5 gap-10 max-w-3xl mx-auto py-24">
                            <motion.div 
                                className="col-span-3 bg-white/5 flex flex-wrap justify-around items-center h-[300px] rounded-[50px] transition duration-150 ease-in-out hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                                 {/* <Square3Stack3DIcon className="h-6 w-6 text-slate-200 p-2 rounded-full bg-slate-400 mt-[5px]" />
                                 <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">Name</h3>
                                 <p className="text-sm font-normal mt-2 text-slate-600">this is some text in a box.</p> */}
                            </motion.div>
                            <motion.div 
                                className="col-span-2 bg-white/5 flex flex-wrap justify-around items-center h-[300px] rounded-[50px] transition duration-150 ease-in-out hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                            </motion.div>

                            <motion.div 
                                className="col-span-2 bg-white/5 flex flex-wrap justify-around items-center h-[300px] rounded-[50px] transition duration-150 ease-in-out hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                            </motion.div>
                            <motion.div 
                                className="col-span-3 bg-white/5 flex flex-wrap justify-around items-center h-[300px] rounded-[50px] transition duration-150 ease-in-out hover:bg-white/10 hover:ring-white/20 backdrop-filter backdrop-blur-md shadow-lg ring-1 ring-white/10 cursor-crosshair"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{scale: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22
                                }}>
                            </motion.div>

                        </div>

  );
}

export default BentoFeatures;