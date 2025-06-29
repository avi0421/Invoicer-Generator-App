"use client";
import { CldImage, CldUploadButton } from 'next-cloudinary';
import React, { useState } from 'react';

export default function Page() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className='flex items-center justify-center h-screen flex-col'>
      <h2 className='mb-12'>Upload File using Cloudinary</h2>
      <CldUploadButton
        onUpload={(data) => {
          console.log(data.info.secure_url);
          setImageUrl(data.info.secure_url);
        }}
        className='bg-violet-600 text-white py-3 px-6 rounded mb-8'
        uploadPreset="invoicePreset"
      />

      {imageUrl && (
        <CldImage
          width={960}
          height={600}
          src={imageUrl}
          sizes="100vw"
          alt="Invoice image"
        />
      )}
    </div>
  );
}
