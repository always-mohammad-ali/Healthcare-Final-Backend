
import app from "./app";

const runServer = () =>{
     try{
        // Start the server
        app.listen(5000, () => {
        console.log(`Server is running on http://localhost:5000`);
});

     }catch(error){
        console.error("Failed to start server: ", error)
     }
}

runServer();