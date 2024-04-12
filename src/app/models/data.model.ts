import { characterModel } from "./character.model";
import { infoModel } from "./info-model";

export class dataModel {
    info: infoModel;
    results: Array<characterModel>;
}