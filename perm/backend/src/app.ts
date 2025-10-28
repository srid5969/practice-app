import express, { Application } from 'express';

 class App{

    public express : Application
   public async init(){
         		this.express = express();

    }
 }

 export default App;