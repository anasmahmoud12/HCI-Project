import { ProductDto } from "./ProductDto";

export interface CategoryDto{

id:number;
name:string;
description:string;
products:ProductDto[];
img:string;


}