"use strict";
import { initView } from "../view/view.js";

window.addEventListener("load", startApp);

function startApp() {
    console.log("controller say hi");
    
    initView();
}