import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import React from "react";

interface ButtonIconLeftProps {
  href: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

const ButtonIconLeft: React.FC<ButtonIconLeftProps> = ({
  href,
  text = "Back", // Default text if none is provided
  icon = <FaArrowLeft />, // Default icon if none is provided
  className = "", // Additional classes can be passed in
}) => {
  return (
    <Link href={href} className={`btn flex items-center ${className}`}>
      {icon && <span className="icon mr-2">{icon}</span>}
      {text}
    </Link>
  );
};

export default ButtonIconLeft;
