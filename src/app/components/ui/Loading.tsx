import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";

export default function Loading() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
            {/* Logo */}
            <img src={IMAGES_ASSETS.LOGO} alt="Logo" className="w-40 h-auto" />

            {/* Infinite Loading Bar */}
            <div className="w-1/6 h-1 bg-primary-gray/25 rounded overflow-hidden relative mt-4">
                <div className="absolute h-full w-1/3 bg-primary animate-loading" />
            </div>
        </div>
    );
}