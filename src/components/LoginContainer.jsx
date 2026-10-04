import { motion } from "motion/react";
import { Google } from "../icons";
import * as login from "../firebase";
import { X } from "lucide-react";

const loginOverlayVariants = {
  hidden: { opacity: 0, pointerEvents: "none", transition: { duration: 0.2 } },
  show: { opacity: 1, pointerEvents: "auto", transition: { duration: 0.2 } },
};

const loginPanelVariants = {
  hidden: {
    opacity: 0,
    y: 200,
    scale: 0.5,
    rotate: 10,
    transition: { type: "spring", stiffness: 260, damping: 16, mass: 0.8 },
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: -2,
    transition: { type: "spring", stiffness: 260, damping: 16, mass: 0.8 },
  },
};

const closeButtonVariants = {
  hidden: {
    y: 40,
    scale: 0,
    transition: { type: "spring", stiffness: 300, damping: 14 },
  },
  show: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 14 },
  },
};

export default function LoginPage({ setLoggingIn, isLoggingIn }) {
  const handleLogin = async (signIn) => {
    try {
      const result = await signIn();
      const user = result.user;

      console.log({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      setLoggingIn(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center font-poppins font-semibold"
      variants={loginOverlayVariants}
      initial="hidden"
      animate={isLoggingIn ? "show" : "hidden"}
    >
      <motion.div
        className="bg-slate-900/80 relative overflow-hidden object-cover backdrop-blur-md w-9/10 sm:w-120 h-3/4 rounded-4xl shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        variants={loginPanelVariants}
        initial="hidden"
        animate={isLoggingIn ? "show" : "hidden"}
      >
        <div className="absolute top-0 inset-x-0 bottom-3/10 flex items-center justify-center">
          <img
            src="/android-chrome-512x512.png"
            alt="image"
            className="drop-shadow-[0_0px_80px_#0f85fa] max-w-70"
          />
        </div>
        <motion.button
          variants={closeButtonVariants}
          initial="hidden"
          animate={isLoggingIn ? "show" : "hidden"}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => setLoggingIn(false)}
          className="bg-white w-10 h-10 rounded-full right-3 top-3 absolute flex items-center justify-center"
        >
          <X className="w-full" />
        </motion.button>
        <div className="flex flex-col items-center justify-center absolute bottom-0 inset-x-0 p-4 gap-4">
            <div className="text-white bg-slate-900 p-5 rounded-3xl font-light">
              Sign in with your Google account to get started with Touch Log and enjoy a fast, secure attendance experience.
            </div>
            <motion.button
              className="cursor-pointer flex items-center justify-center w-full h-fit text-lg gap-4 bg-white/80 py-4 rounded-3xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLogin(login.signInWithGoogle)}
            >
              <Google className="h-7"></Google>
              <div>Sign in with Google</div>
            </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
