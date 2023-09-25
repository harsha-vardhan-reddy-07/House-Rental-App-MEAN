import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true }
})

const propertySchema = new mongoose.Schema({
    ownerId: {type: String},
    ownerName: {type: String},
    description: {type: String},
    carouselImage1: {type: String},
    carouselImage2: {type: String},
    carouselImage3: {type: String},
    rent: {type: Number},
    area: {type: Number},
    deposit: {type: Number},
    agreementDuration: {type: Number},
    availableFor: {type: String},
    furnished: {type: String},
    address: {type: String},
    tenentId: {type: String, default: ''},
    tenentName: {type: String, default: ''},
    rentStartDate: {type: String, default: ''},
    status: {type: String, default: 'Available'},
    applicantsList: {type: Array, default : []},
})

const applicationSchema = new mongoose.Schema({
    propertyId: {type: String},
    ownerId: {type: String},
    ownerName: {type: String},
    carouselImage1: {type: String},
    carouselImage2: {type: String},
    carouselImage3: {type: String},
    description: {type: String},
    rent: {type: Number},
    deposit: {type: Number},
    agreementDuration: {type: Number},
    address: {type: String},
    applicantId: {type: String},
    applicantName: {type: String},
    applicantEmail: {type: String},
    status: {type: String, default:'Pending'}
})

export const User = mongoose.model('users', userSchema);
export const Property = mongoose.model('property', propertySchema);
export const Applications = mongoose.model('applications', applicationSchema);