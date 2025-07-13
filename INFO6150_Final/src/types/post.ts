/*
 * @Author: Jiang Han
 * @Date: 2025-04-25 00:31:33
 * @Description: 
 */
export type Post = {
    id: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    carModel: string;
    carYear: string;
    carColor: string;
    message: string;
    remarks: string;
    status: 'active' | 'completed' | 'pinned';
}