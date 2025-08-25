import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="bg-[#FCFCFC] max-w-[1176px] border border-[#DBDBDB] rounded-[14px] p-6 w-full">
      <div className="flex sm:flex-row flex-col md:w-[458px] sm:mx-auto items-center">
        <Image
          src="/images/Profile1.png"
          alt="profile"
          width={130}
          height={130}
          className=""
        />
        <div className="ml-[24px] w-[304px] text-center">
            <h2 className="sm:text-4xl font-semibold mt-3">Amelia Worden</h2>
            <p className="sm:text-xl text-gray-600">ameliaworden2025@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
