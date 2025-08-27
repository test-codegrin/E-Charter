export default function PaymentPage() {
  return (
    <div className="mt-6 max-w-[1176px] w-full">
      <div className="flex items-center justify-between">
        <div className="">
          <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-4">
            Payment Method
          </h3>
        </div>
        <div className="bg-[#3DBEC8] w-[261px] h-[52px] rounded-full">
          <p className="text-center mt-[13px] text-base font-bold text-[#FFFFFF]">Add payment Method</p>
        </div>
      </div>
      <form className="gap-4 text-sm text-gray-700">
        <div className="col-span-2 mt-[16px]">
          <label className="text-lg font-medium">Credit Card</label>
          <input
            type="text"
            placeholder="**** **** **** 9988"
            className="w-full pb-[16px] border-b border-[#DBDBDB] mt-[15px] outline-none"
          />
        </div>
        <div className="mt-[30px]">
          <label className="text-lg font-medium">Bank Transfer</label>
          <input
            type="text"
            placeholder="Chase Bank ****1234"
            className="w-full pb-[16px] border-b border-[#DBDBDB] mt-[15px] outline-none"
          />
        </div>
        <div className="mt-[30px]">
          <label className="text-lg font-medium">Digital Wallet</label>   
          <input
            type="password"
            placeholder="PayPal, Apple Pay"
            className="w-full pb-[16px] border-b border-[#DBDBDB] mt-[15px] outline-none"
          />
        </div>
      </form>
      <div className="flex justify-end mt-6">
        <button className="bg-[#3DBEC8] font-bold text-base text-white px-6 py-2 rounded-full">
          Save
        </button>
      </div>
    </div>
  );
}
