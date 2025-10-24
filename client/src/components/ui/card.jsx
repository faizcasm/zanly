import React from "react";
import clsx from "clsx";

export function Card({ className, children }) {
  return (
    <div
      className={clsx(
        "rounded-xl border bg-white shadow-sm p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={clsx("mb-2", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3
      className={clsx(
        "text-lg font-semibold leading-tight text-gray-900",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={clsx("text-sm text-gray-700", className)}>
      {children}
    </div>
  );
}
