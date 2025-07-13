/*
 * @Author: Jiang Han
 * @Date: 2025-04-18 16:35:04
 * @Description: 
 */
export interface CatBreed {
    id: string;
    name: string;
    origin: string;
    description: string;
    temperament: string;
    image?: {
        url: string;
    };
}