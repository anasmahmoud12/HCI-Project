import { productImageDto } from "./productImageDto";

export interface ProductDto{
 id:number;
 name:string;
 description:string;
 created_At:string;
 updated_At : string;
 priceBefore :number;
 priceAfter:number;
 stock_quantity:number;
 categoryId:number;
 productImages:productImageDto[];
}
