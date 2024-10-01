import React, { useEffect, useRef, useState } from 'react';
import firebaseConfig from '../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default function Fileupload() {
  const [imageUrl, setImageUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [isError, setIsError] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inpRef = useRef();

  // Au chargement, récupérer l'image du localStorage si elle existe
  useEffect(() => {
    const savedImageUrl = localStorage.getItem('imageUrl');
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    }
  }, []);

  useEffect(() => {
    if (file) {
      setFilename(file.name);
    }
  }, [file]);

  const selectImage = () => {
    inpRef.current.click();
  };

  const handleInputFile = (e) => {
    let fileData = e.target.files[0];
    setFile(fileData);
  };

  const handleImageUpload = () => {
    setIsLoading(true);
    const storageRef = firebase.storage().ref();
    const folderName = 'myimages';
    const fileName = filename;
    const fileRef = storageRef.child(`${folderName}/${fileName}`);
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(Math.round(progress));
      },
      (error) => {
        setIsError(true);
      },
      () => {
        storage
          .ref('myimages')
          .child(fileName)
          .getDownloadURL()
          .then((url) => {
            setImageUrl(url);
            // Enregistrer l'URL dans le localStorage
            localStorage.setItem('imageUrl', url);
          });
        setIsLoading(false);
        console.log('File Uploaded Successfully');
      }
    );
  };

  return (
    <div className='uploadImage'>
      <input type='file' className='inp' accept='image/*' ref={inpRef} onChange={handleInputFile} />
      <button onClick={selectImage}>Select Image to Upload</button>
      {filename ? <span className='fileName'>{filename}</span> : <></>}
      <br />
      <div className='progressBar'>
        {percentage ? <div className='progress' style={{ width: `${percentage}%` }}>{percentage + ' % '}</div> : <>0%</>}
      </div>
      <button onClick={handleImageUpload}>Upload</button>
      {isLoading ? <span className='loading'>Loading....</span> : <></>}
      {imageUrl ? <img src={imageUrl} alt="Uploaded" className='img' /> : <></>}
    </div>
  );
}
