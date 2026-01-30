import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null)
  const [preview, setPreview] = useState(authUser?.profilePic || null)
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  // image preview + cleanup
  useEffect(() => {
    if (!selectedImg) return;

    const objectUrl = URL.createObjectURL(selectedImg)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImg])

  const handleSubmit = async (e) => {
    e.preventDefault();

    let avatar = null;
    if (selectedImg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      avatar = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    }

    await updateProfile({
      fullName: name,
      bio,
      avatar: avatar || authUser?.profilePic
    });
    navigate('/');
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-10 flex-1'
        >
          <h3 className='text-lg'>Profile details</h3>

          {/* Avatar */}
          <label
            htmlFor='avatar'
            className='flex items-center gap-3 cursor-pointer'
          >
            <input
              type='file'
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />

            <img
              src={preview || assets.avatar_icon}
              alt='avatar'
              className='w-12 h-12 rounded-full object-cover'
            />

            <span>Upload profile image</span>
          </label>

          {/* Name */}
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your Name'
            required
            className='p-2 border border-gray-500 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400'
          />

          {/* Bio */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Write profile bio'
            required
            rows={4}
            className='p-2 border border-gray-500 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400'
          />

          <button
            type='submit'
            className='bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md'
          >
            Update Profile
          </button>
        </form>

        <img
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
          src={assets.logo_icon}
          alt='logo'
        />
      </div>
    </div>
  )
}

export default ProfilePage;