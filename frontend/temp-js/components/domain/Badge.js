function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/utils";

//닉네임 옆 뱃지 
const badgeVariants = cva(
// "inline-flex items-center justify-center rounded-full border border-blue-500 px-2.5 py-0.5  cursor-pointer transition-colors",
"", {
  variants: {
    variant: {
      default:
      // "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      "",
      // 타 파일과의 호환 문제로 임시로 남겨둠. 
      secondary: "border-transparent text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
function Badge({
  className,
  variant,
  imgSrc,
  imgAlt,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn(badgeVariants({
      variant
    }), className, "flex items-center gap-2")
  }, props), imgSrc && /*#__PURE__*/React.createElement("img", {
    src: imgSrc,
    className: "w-5 h-5 rounded-full object-contain"
  }));
}
export { Badge, badgeVariants };