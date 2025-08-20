import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border border-[#3DBEC880] rounded-[40px] 2xl:w-[1780px] mb-10 mx-auto mt-10 py-8 px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 text-sm text-gray-700">
        {/* Logo + Desc */}
        <div>
          <div className="flex justify-between items-center">
            <Image src="/bus.svg" alt="Logo" width={90} height={60} />
          </div>
          <p className="mt-3 w-[400px] h-[112px] text-lg leading-[28px] border-2 text-gray-600">
            Faucibus faucibus pellentesque dictum turpis. Id pellentesque turpis
            massa a id iaculis lorem turpis euismod. Purus at quisque integer
            sit. Libero quis sapien tempus.
          </p>
        </div>

        {/* Links */}
        <div className="w-[200px]">
          <h3 className="font-semibold text-xl mb-3">Useful links</h3>
          <ul className="space-y-2 text-base">
            <li>About us</li>
            <li>Contact us</li>
            <li>Gallery</li>
            <li>Blog</li>
            <li>F.A.Q</li>
          </ul>
        </div>

        {/* Vehicles */}
        <div className="w-[200px]">
          <h3 className="font-semibold text-xl mb-3">Vehicles</h3>
          <ul className="space-y-2 text-base">
            <li>Sedan</li>
            <li>Cabriolet</li>
            <li>Pickup</li>
            <li>Minivan</li>
            <li>SUV</li>
          </ul>
        </div>

        {/* Services */}
        <div className="w-[200px]">
          <h3 className="font-semibold text-xl mb-3">Services</h3>
          <ul className="space-y-2 text-base">
            <li>Sedan</li>
            <li>Cabriolet</li>
            <li>Pickup</li>
            <li>Minivan</li>
            <li>SUV</li>
          </ul>
        </div>
      </div>

      {/* Bottom Contact Info */}
      <div className="w-[1702px] mx-auto mt-8 border-t border-[#1FC091] pt-4 text-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="flex w-[150px] items-center h-[40px] justify-between border-2 mt-4">
          <div className="bg-[#3DBEC8] rounded-3xl w-[40px] h-[40px]">
            <Facebook className="w-5 h-5 mt-[9px] ml-[9px] text-[#FFFFFF]" />
          </div>
          <div className=" bg-[#3DBEC8] rounded-3xl w-[40px] h-[40px]">
            <Instagram className="w-5 h-5 mt-[10px] ml-[10px] text-[#FFFFFF]" />
          </div>
          <div className="bg-[#3DBEC8] rounded-3xl w-[40px] h-[40px]">
            <Youtube className="w-5 h-5 mt-[10px] ml-[10px] text-[#FFFFFF]" />
          </div>
        </div>
        {/* <p>
          <span className="font-medium">Address:</span> Oxford Ave. Cary, NC
          27511
        </p>
        <p>
          <span className="font-medium">Email:</span> mwiger@yahoo.com
        </p>
        <p>
          <span className="font-medium">Phone:</span> +537 547-6401
        </p> */}
      </div>
    </footer>
  );
}
