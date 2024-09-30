import React, { useEffect, useRef, useState } from 'react'
import firebaseConfig from '../firebase'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default function Fileupload() {


  const [imageUrl, setimageUrl] = useState('');
  const [filename, setfilename] = useState('');
  const [percentage, setpercentage] = useState(0);
  const [isError, setisError] = useState(false);
  const [file, setfile] = useState(null);
  const [isLoading, setisLoading] = useState(false);


  useEffect(() => {
    if (file) {
      setfilename(file.name);
    }
  }, [file])



  const inpRef = useRef();


  const selectImage = () => {
    inpRef.current.click();
  }


  const handleInputeFile = (e) => {
    console.log(e.target.files[0]);
    let fileData = e.target.files[0];
    setfile(fileData);
  }


  const handleImageUpload = () => {
    setisLoading(true);
    const storageRef = firebase.storage().ref();
    const folderName = 'myimages';
    const fileName = filename;
    setfilename(fileName);
    const fileRef = storageRef.child(`${folderName}/${fileName}`);
    const uploadTask = fileRef.put(file);

    uploadTask.on('state_changed', (snapshot) => {

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setpercentage(Math.round(progress));
    },
      (error) => {
        if (error) {
          setisError(true)
        }
      }, () => {
        storage.ref("myimages").child(filename).getDownloadURL().then((url) => {
          setimageUrl(url);
        })
        setisLoading(false);
        console.log("File Uploaded Successfully");
      })
  }

  return (
    <div className='uploadImage'>
      {/*<h1>Firebase Image Uploade</h1>*/}
      <input type='file' className='inp' accept='image/*' ref={inpRef} onChange={handleInputeFile} />
      <button onClick={selectImage}>Select Image to Upload</button>
      {filename? <span className='fileName'>{filename}</span>:<></>}
      <br />
      <div className='progressBar'>
        {percentage?  <div className='progress' style={{width:`${percentage}%`}}>{percentage+' % '}</div>:<>0%</>}
      </div>
      <button onClick={handleImageUpload}>Uploade</button>
      {isLoading? <span className='loading'>Loading....</span> : <></>}
      {imageUrl? <img src={imageUrl} alt="images" className='img'/>:<></>}
    </div>
  )
}
