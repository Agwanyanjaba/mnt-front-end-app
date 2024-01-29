"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        alt="Logo"
        className="cursor-pointer mx-4 my-0 sm:block"
        height="40"
        width="180"
        src="/images/logo.jpeg"
      />
    </Link>
  );
};

export default Logo;
