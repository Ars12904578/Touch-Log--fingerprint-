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
  const handleLogin = async () => {
    try {
      const result = await login.signInWithGoogle();

      console.log({
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
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
        className="relative h-3/4 w-9/10 overflow-hidden rounded-4xl bg-slate-900/80 object-cover shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xs sm:w-120"
        variants={loginPanelVariants}
        initial="hidden"
        animate={isLoggingIn ? "show" : "hidden"}
      >
        <div className="absolute inset-x-0 bottom-4/11 top-0 flex items-center justify-center">
          <img
            src="/android-chrome-512x512.png"
            alt="Touch Log logo"
            className="max-w-60 drop-shadow-[0_0px_80px_#0f85fa]"
          />
        </div>

        <motion.button
          variants={closeButtonVariants}
          initial="hidden"
          animate={isLoggingIn ? "show" : "hidden"}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => setLoggingIn(false)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white"
          aria-label="Close login dialog"
        >
          <X className="w-full" />
        </motion.button>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center gap-4 p-4">
          <div className="rounded-3xl bg-slate-900 p-5 text-white font-light">
            Sign in with your Google account to get started with Touch Log and enjoy a fast, secure attendance experience.
          </div>

          <motion.button
            className="flex h-fit w-full cursor-pointer items-center justify-center gap-4 rounded-3xl bg-white/80 py-4 text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogin}
          >
            <Google className="h-7" />
            <span>Sign in with Google</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
