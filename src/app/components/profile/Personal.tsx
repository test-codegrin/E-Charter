export default function PersonalPage() {
  return (
    <div className="mt-6 max-w-[1176px] min-h-[519px] w-full">
      <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-4">
        Personal Info
      </h3>
      <form className="grid mt-[30px] grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <label className="text-lg text-[#040401] font-medium">First Name</label>
          <input type="text" className="w-full border-b border-[#DBDBDB] mt-[0px] outline-none" />
        </div>
        <div>
          <label className="text-lg text-[#040401] font-medium">Last Name</label>
          <input type="text" className="w-full border-b border-[#DBDBDB] outline-none" />
        </div>
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">Email Address</label>
          <input type="email" className="w-full border-b border-[#DBDBDB] outline-none" />
        </div>
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">Phone Number</label>
          <input type="tel" className="w-full border-b border-[#DBDBDB] outline-none" />
        </div>
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">City</label>
          <input type="text" className="w-full border-b border-[#DBDBDB] outline-none" />
        </div>
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">Zip Code</label>
          <input type="text" className="w-full border-b border-[#DBDBDB] outline-none" />
        </div>
        <div className="col-span-2 mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">Address</label>
          <input type="text" className="w-full border-b border-[#DBDBDB] outline-none" />
        </div>
      </form>
      <div className="flex justify-end mt-6">
        <button className="bg-[#3DBEC8] font-bold text-base text-white px-6 py-2 rounded-full">
          Edit
        </button>
      </div>
    </div>
  );
}
