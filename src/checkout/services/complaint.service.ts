import { Complaint, IComplaint } from "../models/complaint.model";


const createComplaint = async (dto: Pick<IComplaint, 'user_id'|'product_id'|'complaint_text'|'status'>)=>{
    return await Complaint.create({...dto});
}

export const complaintService = {
    createComplaint
}