"use client"
import Tilt from 'react-parallax-tilt';
import Image from "next/image";
import { Pill } from "./Pill";

export const SkeletonCard = () => {
    const imageSrc = "/images/hacker.png"
    return (
        <Tilt
            glareEnable={true}
            glareColor="#ffffff"
            glareBorderRadius="8px"
        >
            <div className="group grid grid-cols-1 sm:grid-cols-3 max-w-sm sm:max-w-lg hover:z-20 hover:shadow-lg hover:shadow-other rounded-lg transition-all duration-300 ease-in-out gap-x-2 h-full opacity-60 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
                <div
                    aria-hidden
                    className="absolute h-full w-full -z-10"
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(8px)',
                    }}
                />

                {/* Content */}
                <div className="col-span-1 relative">
                    <Image
                        className="rounded-lg blur-none p-2 mx-auto bg-gray-700/50 animate-pulse"
                        src={imageSrc}
                        width={160}
                        height={160}
                        alt=""
                    />
                    <p className="text-xs border border-current m-2 px-2 py-1 rounded-lg group-hover:text-white text-gray-400 absolute bottom-1 group-hover:bg-secondary/50 bg-gray-700/50 animate-pulse">
                        &nbsp;
                    </p>
                </div>

                <div className="col-span-1 sm:col-span-2 p-2 mx-2">
                    <h3 className="text-xl p-2 font-body backdrop-filter backdrop-blur-lg  text-primary bg-gray-700/50 animate-pulse rounded">
                        &nbsp;
                    </h3>
                    <div className="py-1 gap-2 flex items-center justify-start flex-row flex-wrap font-display">
                        <Pill tag={'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'} />
                        <Pill tag={'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'} />
                        <Pill tag={'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'} />
                    </div>
                    <p className="font-display backdrop-filter backdrop-blur-lg bg-opacity-65 p-2 group-hover:text-white text-gray-300 bg-gray-700/50 animate-pulse rounded">
                        &nbsp;
                    </p>
                </div>
            </div>
        </Tilt>
    )
}