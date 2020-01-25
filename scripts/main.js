import {App} from "../Classes/App.js";
import {ContentProcessor} from "../Classes/ContentProcessor.js";


export const processor=new ContentProcessor();
export const app = new App();
document.body.appendChild(app);