import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoTrash } from 'react-icons/io5';
import { deleteObject, ref } from 'firebase/storage';
import { deleteAlbumById, deleteArtistById, deleteSongById, getAllAlbums, getAllArtists, getAllSongs } from '../api';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { storage } from '../config/firebase.config';

const SongCard = ({ data, index, type }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [{ alertType, allArtists, allAlbums, allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();

  const deleteData = async (data) => {
    try {
      // Delete song
      if (type === 'song') {
        const deleteRef = ref(storage, data.imageURL);
        await deleteObject(deleteRef);
        const res = await deleteSongById(data._id);
        if (res.data) {
          const allSongs = await getAllSongs();
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: allSongs.data,
          });
        }
      }
      // Delete artist
      if (type === 'artist') {
        const res = await deleteArtistById(data._id);
        if (res.data) {
          const allArtists = await getAllArtists();
          dispatch({
            type: actionType.SET_ALL_ARTISTS,
            allArtists: allArtists.data,
          });
        }
      }
      // Delete album
      if (type === 'album') {
        const res = await deleteAlbumById(data._id);
        if (res.data) {
          const allAlbums = await getAllAlbums();
          dispatch({
            type: actionType.SET_ALL_ALBUMS,
            allAlbums: allAlbums.data,
          });
        }
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const addToContext = () => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };

  return (
    <motion.div
      className='relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:bg-card bg-zinc-800 shadow-md rounded-md flex flex-col items-center'
      onClick={type === 'song' ? addToContext : undefined}
    >
      <div className='w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden'>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          className='w-full h-full rounded-lg object-cover'
        />
      </div>

      <p className='text-base text-center text-headingColor font-semibold my-2'>
        {data.name.length > 25 ? `${data.name.slice(0, 25)}..` : data.name}
        {data.artist && (
          <span className='block text-sm text-gray-400 my-1'>
            {data.artist.length > 25 ? `${data.artist.slice(0, 25)}..` : data.artist}
          </span>
        )}
      </p>

      <div className='w-full absolute bottom-2 right-2 flex items-center justify-between px-4'>
        <motion.i
          whileTap={{ scale: 0.75 }}
          className='text-base text-red-400 drop-shadow-md hover:text-red-600'
          onClick={() => setIsDelete(true)}
        >
          <IoTrash />
        </motion.i>
      </div>
      {isDelete && (
        <motion.div
          className='absolute inset-0 backdrop-blur-md bg-cardOverlay flex items-center flex-col justify-center px-4 py-2 gap-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className='text-lg text-zinc-900 font-semibold text-center'>Are you sure do you want to delete it?</p>
          <div className='flex items-center gap-4'>
            <motion.button
              className='px-2 py-1 text-sm  uppercase bg-green-300 rounded-md hover:bg-green-500 cursor-pointer'
              whileTap={{ scale: 0.7 }}
              onClick={() => deleteData(data)}
            >
              Yes
            </motion.button>
            <motion.button
              className='px-2 py-1 text-sm  uppercase bg-red-300 rounded-md hover:bg-red-500 cursor-pointer'
              whileTap={{ scale: 0.7 }}
              onClick={() => setIsDelete(false)}
            >
              No
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SongCard;
