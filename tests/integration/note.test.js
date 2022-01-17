// import { expect } from 'chai';
// import request from 'supertest';
// import mongoose from 'mongoose';
// import HttpStatus from 'http-status-codes';

// import fs from 'fs';

// import app from '../../src/index.js';

// describe('Notes APIs Test', () => {

//     before((done) => {
//         const clearCollections = () => {
//             for (const collection in mongoose.connection.collections) {
//                 mongoose.connection.collections[collection].deleteOne(() => {});
//             }
//         };

//         const mongooseConnect = async() => {
//             await mongoose.connect(process.env.userDATABASE_TEST);
//             clearCollections();
//         };

//         if (mongoose.connection.readyState === 0) {
//             mongooseConnect();
//         } else {
//             clearCollections();
//         }

//         done();
//     });

//     const jsonFileNote = fs.readFileSync('tests/integration/note.json')
//     const jsonFileUser = fs.readFileSync('tests/integration/user.json')
//     const noteData = JSON.parse(jsonFileNote);
//     const userData = JSON.parse(jsonFileUser)
//         // let jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyZWV1c2UxNEBnbWFpbC5jb20iLCJfaWQiOiI2MWUxN2U1MGY5Nzc3YjA0YjAzMTBlNTAiLCJpYXQiOjE2NDIxNjc4OTN9.mENYTcebImuCKmi64V5mYdwoAVN3zyHeKJSYKMeyEKo';
//     let jwtToken = '';

//     beforeEach((done) => {
//         request(app)
//             .post('/api/v1/users/login')
//             .send(userData.validLogin)
//             .end((err, res) => {
//                 jwtToken = res.body.data;
//                 expect(res.statusCode).to.be.equal(HttpStatus.OK);
//                 expect(res.body.data).to.be.not.null;
//                 done();
//             });

//     })

//     describe('POST /createNote', () => {
//         it('given new note when added should return status 201', (done) => {
//             request(app)
//                 .post('/api/v1/notes/createNote')
//                 .set('token', `${jwtToken}`)
//                 .send(noteData.validNote)
//                 .end((err, res) => {
//                     expect(res.statusCode).to.be.equal(HttpStatus.CREATED);
//                     done();
//                 });
//         });
//     });
// });