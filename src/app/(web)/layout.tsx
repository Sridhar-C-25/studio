import type { PropsWithChildren } from "react";

export default function WebLayout({ children }: PropsWithChildren) {
  return (
    <div>
      {children}
    </div>
  );
}
