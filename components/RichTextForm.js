import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor.js";
import axios from "axios";
import { convertToRaw } from "draft-js";
import { useRouter } from "next/router.js";
import Spinner from "./Spinner.js";
import Image from "next/image.js";

export default function RichText({
    _id,
    title:existingTitle,
    images:existingImages,
    content:existingContent

}){
    const [content, setContent]=useState(existingContent||'')
    const [title,setTitle]=useState(existingTitle||'')
    const [goToBulletins, setgoToBulletins]= useState(false)
    const [isUploading ,setIsUploading]=useState(false)
    const [images,setImages]=useState(existingImages||[])
    const [loadedImages, setLoadedImages] = useState(Array(images.length).fill(false));


    async function saveBulletin(ev){
        ev.preventDefault()
        const data={title,content,images}
        if(_id){
            await axios.put('/api/bulletin',{...data,_id})
        }
        else{
        await axios.post('/api/bulletin',data)
        }
       
        setgoToBulletins(true)
        


    }
    const router = useRouter()

    useEffect(()=>{
        if(goToBulletins){
            router.push('/bulletin')
        }
    },[goToBulletins,router ])
    const handleEditorStateChange = (editorState) => {
        const contentState = editorState.getCurrentContent();
        setContent(JSON.stringify(convertToRaw(contentState))); // Convert editorState to content
      };

    async function uploadImages(ev){
        const files = ev.target?.files;
        if(files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for(const file of files){
                data.append('file',file);
    
            }
           const res = await axios.post('/api/upload',data)
           const newImages = res.data.links 
           setImages(oldImages => 
             [...oldImages, ...newImages]
           );
           setLoadedImages(oldLoadedImages => [...oldLoadedImages, ...Array(newImages.length).fill(false)]);
           setIsUploading(false)
            
            //console.log(res.data)
        }
    }
  
    
    return (
        <form onSubmit={saveBulletin} >
            <label>Title</label>
            <input value={title} onChange={ev=>setTitle(ev.target.value)} type="text" placeholder="title"/>
            <label>Cover Photo</label>

          
            <div className="mb-2 flex flex-wrap gap-1">
         
                   
                    {!!images?.length && images.map(link => (
                        <div key={link} className='h-24  bg-white p-4  shadow-sm rounded-sm border border-gray-200  '>
                                                     
                         <Image
                            width={100}
                            height={150}
                            src={link}
                            alt=''
                            className="rounded-lg"
                            onError={(e) => {
                                e.target.src = link
                          }}/> 
                        </div>
                    ))}
                  
                    {isUploading && (
                        <div className="h-24">
                            <Spinner/>
                        </div>  
                    )}
                   
                    <label className='cursor-pointer w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>

                        Upload
                        <input type="file" className="hidden" onChange={uploadImages}/>
                    </label>
                  
                 

                </div>
                <label>Content</label>
         
            <RichTextEditor onEditorStateChange={handleEditorStateChange} initialContent={existingContent}/> 
            
          
       

            <button className="btn-primary py-2 " type="submit">Save</button>
             
            
        </form>
        
    )
}