import { AppDataSource } from "./data-source"
import {main} from "./bootstrap";

AppDataSource.initialize().then(async () => {
    await main();
}).catch(error => console.log(error))
