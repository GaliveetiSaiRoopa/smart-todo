import React from "react";

interface Props {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  width?: any;
  height?: any;
  icon?: any;
  bgColor?: any;
}

const PrimaryBtn: React.FC<Props> = ({
  label,
  onClick,
  disabled,
  width,
  icon,
  height,
  bgColor,
}: Props) => {
  return (
    <div className={`${width}`}>
      <button
        onClick={onClick}
        className={`text-white cursor-pointer w-full ${
          height || "md:h-[42px] h-10"
        } lg:px-5 md:px-4 px-2 flex items-center justify-center rounded-sm lg:text-base text-xs font-medium`}
        style={{
          backgroundColor: bgColor || "#000000",
        }}
      >
        {/* {icon && <img width={20} height={20} src={icon} alt="icon" />} */}
        {label}
      </button>
    </div>
  );
};

export default PrimaryBtn;
