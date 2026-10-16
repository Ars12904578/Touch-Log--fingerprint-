import { motion, useReducedMotion } from "motion/react";
import { Google } from "../icons";
import * as login from "../firebase";
import { X } from "lucide-react";

export default function LoginPage({ setLoggingIn }) {
  const reducedMotion = useReducedMotion();
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.14, ease: "easeOut" }}
    >
      <motion.div
        className="relative h-9/10 w-9/10 overflow-hidden rounded-4xl bg-slate-900/80 object-cover shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md sm:w-120"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 6, scale: reducedMotion ? 1 : 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : 4, scale: reducedMotion ? 1 : 0.99 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.16, ease: "easeOut" }}
      >
        <div className="absolute inset-x-0 bottom-4/11 top-0 flex items-center justify-center">
          <img
            src="/android-chrome-512x512.png"
            alt="Touch Log logo"
            className="max-w-50 drop-shadow-[0_0px_80px_#0f85fa]"
          />
        </div>

        <button
          type="button"
          onClick={() => setLoggingIn(false)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Close login dialog"
        >
          <X className="w-full" />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center gap-4 p-4">
          <div className="rounded-3xl bg-slate-900 p-5 text-white font-light">
            Sign in with your Google account to get started with Touch Log and enjoy a fast, secure attendance experience.
          </div>

          <button
            type="button"
            className="flex h-fit w-full cursor-pointer items-center justify-center gap-4 rounded-3xl bg-white/80 py-4 text-lg transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={handleLogin}
          >
            <Google className="h-7" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
