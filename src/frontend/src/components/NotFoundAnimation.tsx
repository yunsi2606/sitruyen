"use client";

import Lottie from "lottie-react";
import animationData from "@/assets/lottie/not-found.json";

export function NotFoundAnimation() {
    return (
        <div className="w-full max-w-[500px] h-full mx-auto opacity-90 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}
