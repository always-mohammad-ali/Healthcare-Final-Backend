
import app from "./app";
import { envVar } from "./config/env";

const runServer = () =>{
     try{
        // Start the server
        app.listen(envVar.PORT, () => {
        console.log(`Server is running on http://localhost:${envVar.PORT}`);
});

     }catch(error){
        console.error("Failed to start server: ", error)
     }
}

runServer();