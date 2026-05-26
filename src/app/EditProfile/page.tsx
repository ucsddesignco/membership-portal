import React from 'react';

const EditProfile = () => {
  return (
    <div className='justify-center m-auto'>
      <div className="flex flex-row p-10 gap-32">
        <div>
          <div className="h-64 w-64 bg-white rounded-full "></div>
          <div className="flex flex-col p-4 gap-4">
            <button className="flex border rounded p-2 justify-center cursor-pointer">
              Remove Profile Picture
            </button>
            <button className="flex text-black bg-white rounded p-2 justify-center cursor-pointer">
              Change Profile Picture
            </button>
          </div>
        </div>
        <section className="flex flex-col">
          <h1 className="text-[5rem] leading-tight">Edit Profile</h1>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-5">
            <label>Name</label>

            <input
              type="text"
              placeholder="name"
              className="px-20 py-4 bg-white text-black text-center"
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="email"
              className="px-20 py-4 bg-white text-black text-center"
            />
            <label>Birthday</label>
            <input
              type="date"
              placeholder="birth"
              className="px-20 py-4 bg-white text-black text-center"
            />
            <label>Gender</label>
            <input
              type="text"
              placeholder="gender"
              className="px-20 py-4 bg-white text-black text-center"
            />
            <label>Grad Year</label>
            <input
              type="text"
              placeholder="grad year"
              className="px-20 py-4 bg-white text-black text-center"
            />
            <label>Major</label>
            <input
              type="text"
              placeholder="major"
              className="px-20 py-4 bg-white text-black text-center"
            />
            <label>Change Your Password</label>
            <button className="flex border rounded p-2 justify-center cursor-pointer">
              Send a Reset Link
            </button>
          </div>
        </section>
      </div>
      <div className="flex flex-row p-4 gap-4 justify-end">
        <button className="w-64 flex border rounded p-2 justify-center cursor-pointer">
          Discard Changes
        </button>
        <button className="w-64 flex text-black bg-white rounded p-2 justify-center cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
