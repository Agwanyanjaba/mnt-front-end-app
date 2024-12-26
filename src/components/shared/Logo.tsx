"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        alt="Logo"
        className="hidden cursor-pointer mx-4 sm:block"
        height="30"
        width="90"
        src="/images/logo.jpeg"
      />
    </Link>
  );
};

export default Logo;
