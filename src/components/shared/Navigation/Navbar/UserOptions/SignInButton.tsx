"use client";

import { signIn } from "next-auth/react";
import { MdOutlineAccountCircle } from "react-icons/md";

const SignInButton = () => {
  return (
    <button
      className="flex flex-row gap-1 items-center border-[1px] border-slate-700 rounded-full overflow-hidden px-3 py-1.5 text-blue-400 cursor-pointer text-xl"
      onClick={() => signIn("google")}
    >
      <MdOutlineAccountCircle className="h-10 w-10"/>
      Login
    </button>
  );
};

export default SignInButton;
