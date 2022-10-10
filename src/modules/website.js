import createHeader  from "./layout/header";
import createFooter from "./layout/footer";
import { setInfo } from "./layout/main";

async function createSite() {
    const body = document.querySelector('body');
    body.appendChild(createHeader());
    await setInfo('metric');
    body.appendChild(createFooter());

}

export default createSite;