import React from "react";
import dynamic from 'next/dynamic'

const FileViewerComponent = dynamic(() => import('../../components/FileViewerComponent'))


const Document = () => {
  return (
    <>
      {" "}
      <div>Document</div>
      <FileViewerComponent />
    </>
  );
};

export default Document;
