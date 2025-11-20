import {savePost,getSavedPost,removeSavedPostFromCollection}from "../../controllers/Instagram/saved-post";


export const instagramSavedPostRouter = (app)=>{
    app.post('/api/instagram/saved-post',savePost);
    app.get('/api/instagram/saved-post',getSavedPost);
    app.delete('/api/instagram/saved-post/:id',removeSavedPostFromCollection);
}