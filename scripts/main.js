import {App} from "../Classes/App.js";
import {DB} from "../Classes/DB.js";

export const db = new DB();
export const app = new App();
document.body.appendChild(app);