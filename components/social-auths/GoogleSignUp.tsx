import Image from "next/image";
import React from "react";

const GoogleSignUp = () => {
  return (
    <div
      className="flex items-center gap-3 justify-center border border-slate-300 
    rounded-md p-1.5 cursor-pointer"
    >
      <Image
        src="/images/google.png"
        alt="Google"
        width={25}
        height={25}
        className="object-contain"
      />
      <p className="font-semibold">Sign Up with Google</p>
    </div>
  );
};

export default GoogleSignUp;
