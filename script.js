const result=document.getElementById("result");

const setResult=(text,isLoadingResults)=>{
    if(!text && isLoadingResults) result.innerText="Loading....";
    else if(!text) result.innerText="Select Images To Match Faces"
    else result.innerText=text;
}
setResult("",false)
const isFacesMatched=async(imgFile1,imgFile2,accuracy)=>{
    try{
        // loading models
        await faceapi.loadSsdMobilenetv1Model('/models')
        await faceapi.loadTinyFaceDetectorModel('/models')
        await faceapi.loadMtcnnModel('/models')
        await faceapi.loadFaceLandmarkModel('/models')
        await faceapi.loadFaceLandmarkTinyModel('/models')
        await faceapi.loadFaceRecognitionModel('/models')
        await faceapi.loadFaceExpressionModel('/models')

        // Create image element from blob 
        const image1=await faceapi.bufferToImage(imgFile1);
        const image2=await faceapi.bufferToImage(imgFile2);

        if(!(image1 && image2)) return {status:"failed",message:"Erorr in Getting Images"};

        // Geting face descriptors
        const face1Descriptor=await faceapi.computeFaceDescriptor(image1)
        const face2Descriptor=await faceapi.computeFaceDescriptor(image2)
        
        if(!(face1Descriptor && face2Descriptor)) return {status:"failed",error:"Erorr in Detecting images"};

        const distance=faceapi.euclideanDistance(face1Descriptor,face2Descriptor,accuracy);

        const accuracyInPoints=accuracy/10;

        if(distance<=accuracyInPoints) return {status:"success",message:"Faces Matched"};
        else return {status:"failed",message:"Faces Not Matched"};
    }
    catch(error){
        return {status:"failed",message:"Erorr in Getting Results"};
    }
}
const matchImages=async(e)=>{
    e.preventDefault();
    try{
        setResult("",true);
        const img1=document.getElementById("img1");
        const img2=document.getElementById("img2");
        const accuracy=parseInt(document.getElementById("accuracy").value);
        
        const img1Len=img1.files.length;
        const img2Len=img2.files.length;
    
        if(img1Len!=1 && img2Len!=1) throw new Error("Pls Select Images");
    
        const img1Blob=img1.files[0];
        const img2Blob=img2.files[0];
    
        const isMatched=await isFacesMatched(img1Blob,img2Blob,accuracy);
    
        if(isMatched.status==="failed") setResult(isMatched.message,false)
        else setResult(isMatched.message,false);
    }
    catch(error){
        setResult(error.message,false); 
    }
}