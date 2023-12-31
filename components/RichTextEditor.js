import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ContentState, EditorState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FaBeer } from "react-icons/fa";
 const Editor = dynamic(
    ()=> import("react-draft-wysiwyg").then((module)=>module.Editor),
    {
    ssr:false,
 });    

 

export default function RichTextEditor({ onEditorStateChange, initialContent }){
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      const contentState =  convertFromRaw(JSON.parse(initialContent))
       return EditorState.createWithContent(contentState);
    } else {
      // Add a return statement here to return an empty EditorState
      return EditorState.createEmpty();
    }
  }); 
    
    const handleEditorChange = (editorState) => {
      setEditorState(editorState);
      onEditorStateChange(editorState); // Pass the editorState to the parent component
    };
  
   
    return ( 
        <div className="bg-gray-100 pb-16 ">
                <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange} 
                    toolbarClassName=" text-md flex sticky-top-0 z-50  !justify-center mx-auto"
                    editorClassName='mt-6 p-10  bg-white min-h-screen shadow-lg max-w-4xl mx-auto mb-12 border'
                    toolbar={{
                        options: ['inline', 'blockType','fontSize', 'list', 'textAlign'],
                        inline: {
                          options: ['bold', 'italic', 'underline'],
                        },
                        blockType: {
                          inDropdown: true,
                          options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'],
                        },
                        fontSize: {
                          icon: <FaBeer />,
                          inDropdown:true,
                          options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                          
                        },
                        list: {
                          options: ['unordered', 'ordered'],
                        },
                        textAlign: {
                          options: ['left', 'center', 'right'],
                        },
                        
                        
                      }}
                    />
        </div>
        
    )
 
}