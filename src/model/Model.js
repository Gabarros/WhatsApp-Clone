import { ClassEvent } from "../util/ClassEvent";

export class Model extends ClassEvent{

    constructor(){
        super();
        this._data = {};


    }

    fromJson(json){

        this._data = Object.assign(this._data, json);
        this.trigger('datachange', this.toJson());

    }

    toJson(){

        return this._data;
    }
}