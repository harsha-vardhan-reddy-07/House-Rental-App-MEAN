import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {User, Property, Applications } from './Schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/HouseRental', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{


    // Register user

    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                usertype,
                password: hashedPassword
            });
            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Login user

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {


            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            } else{
                
                return res.json(user);
            }
            
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });


     // new property

     app.post('/new-property', async(req, res)=>{
        const {ownerId, ownerName, description, carouselImage1, carouselImage2, carouselImage3, rent, area, deposit, agreementDuration, availableFor, furnished, address } = req.body;

        try{

            const newProperty = new Property({ownerId, ownerName, description, carouselImage1, carouselImage2, carouselImage3, rent, area, deposit, agreementDuration, availableFor, furnished, address });
            await newProperty.save();
            res.json({message:"property saved"});
            
        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })

   
    // update property details

    app.post('/update-property', async(req, res)=>{
        const {propertyId, ownerId, ownerName, description, carouselImage1, carouselImage2, carouselImage3, rent, area, deposit, agreementDuration, availableFor, furnished, address }  = req.body;

        try{
            const property = await Property.findById(propertyId);

            property.description = description;
            property.carouselImage1 = carouselImage1;
            property.carouselImage2 = carouselImage2;
            property.carouselImage3 = carouselImage3;
            property.rent = rent;
            property.area = area;
            property.deposit = deposit;
            property.agreementDuration = agreementDuration;
            property.availableFor = availableFor;
            property.furnished = furnished;
            property.address = address;

            await property.save();
            return res.json({message:"property updated"});
            

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // fetch all properties

     app.get('/fetch-properties', async(req, res)=>{
        try{
            const properties = await Property.find();
            res.json(properties);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


     // fetch property data

     app.get('/fetch-property-data/:id', async(req, res)=>{
        try{
            const property = await Property.findById(req.params.id);
            res.json(property);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

      // freeze property

      app.put('/freeze-property', async(req, res)=>{
        const {id} = req.body;
        try{
            const property = await Property.findById(id);
            property.status = 'Freezed';
            await property.save();
            res.json(property);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

     // activate property

     app.put('/activate-property', async(req, res)=>{
        const {id} = req.body;
        try{
            const property = await Property.findById(id);
            property.status = 'Available';
            await property.save();
            res.json(property);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


      //  fetch all users

    app.get('/fetch-users', async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

     //  fetch all applications

    app.get('/fetch-applications', async(req, res)=>{
        try{
            const applications = await Applications.find();
            res.json(applications);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })



     //  book a property

     app.post('/book-property', async(req, res)=>{
        const {propertyId, userId} = req.body;
        try{
            const property = await Property.findById(propertyId);
            const user = await User.findById(userId);

            const applications = new Applications({propertyId, ownerId: property.ownerId, ownerName: property.ownerName, carouselImage1: property.carouselImage1, carouselImage2: property.carouselImage2, carouselImage3: property.carouselImage3, description: property.description, rent: property.rent, deposit: property.deposit, agreementDuration: property.agreementDuration, address: property.address, applicantId: userId, applicantName: user.username, applicantEmail: user.email})
            await applications.save();
            property.applicantsList.push(userId);
            await property.save();

            res.json(applications);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // Withdraw user booking

     app.post('/withdraw-user-booking', async(req, res)=>{
        const {applicationId, userId} = req.body;
        try{
            const application = await Applications.findById(applicationId);
            application.status = "Withdrawn";

            await Property.findByIdAndUpdate(
                application.propertyId,
                { $pull: { applicantsList: userId } },
            );
            await application.save();
            res.json(application);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // Approve application

    app.put('/approve-application', async(req, res)=>{
        const {applicationId} = req.body;
        try{
            const application = await Applications.findById(applicationId);
            application.status = "Accepted";
            
            const property = await Property.findById(application.propertyId);
            
            property.tenentId = application.applicantId;
            property.tenentName = application.applicantName;
            property.rentStartDate = new Date();
            property.applicantsList = [];
            property.status = "Booked";

            await application.save();
            await property.save();

            const remainingApplications = await Applications.find({propertyId: application.propertyId, status: 'Pending'});

            if(remainingApplications.length > 0){
                remainingApplications.map(async (remainingApplication)=>{
                    remainingApplication.status = "Rejected";
                    await remainingApplication.save();
                });
            }

            res.json(application);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // reject application

    app.put('/reject-application', async(req, res)=>{
        const {applicationId} = req.body;
        try{
            const application = await Applications.findById(applicationId);
            application.status = "Rejected";

            await Property.findByIdAndUpdate(
                application.propertyId,
                { $pull: { applicantsList: application.applicantId } },
            );

            await application.save();
            res.json(application);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // vacate tenent

    app.put('/vacate-tenent', async(req, res)=>{
        const {propertyId} = req.body;
        try{
            const property = await Property.findById(propertyId);
            property.status = "Available";
            property.tenentId = '';
            property.tenentName = '';
            property.rentStartDate = '';

            await property.save();
            res.json(property);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })

     



    app.listen(PORT, ()=>{
        console.log(`Running @ ${PORT}`);
    });
}
).catch((e)=> console.log(`Error in db connection ${e}`));