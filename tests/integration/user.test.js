import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import fs from 'fs';

import app from '../../src/index.js';

describe('User APIs Test', () => {
    before((done) => {
        const clearCollections = () => {
            for (const collection in mongoose.connection.collections) {
                mongoose.connection.collections[collection].deleteOne(() => {});
            }
        };

        const mongooseConnect = async() => {
            await mongoose.connect(process.env.userDATABASE_TEST);
            clearCollections();
        };

        if (mongoose.connection.readyState === 0) {
            mongooseConnect();
        } else {
            clearCollections();
        }

        done();
    });

    const jsonFileUser = fs.readFileSync('tests/integration/user.json')
    const jsonFileNote = fs.readFileSync('tests/integration/note.json')
    const noteData = JSON.parse(jsonFileNote);
    const userData = JSON.parse(jsonFileUser);
    let jwtToken = '';
    let invalidToken = '';
    let _id = '';

    //register user test
    describe('POST /registration', () => {
        it('given new user when added should return status 201', (done) => {
            request(app)
                .post('/api/v1/users/registration')
                .send(userData.validRegistration)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.CREATED);
                    done();
                });
        });

        it('given user when not registered should return status 500', (done) => {
            request(app)
                .post('/api/v1/users/registration')
                .send(userData.invalidRegistration)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    done();
                });
        });

        it('given user when provides empty details should return status 500', (done) => {
            request(app)
                .post('/api/v1/users/registration')
                .send(userData.emptyRegistration)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    done();
                });
        });
    });

    //user login test
    describe('POST /login', () => {
        it('given user when logged in should return status 200', (done) => {
            request(app)
                .post('/api/v1/users/login')
                .send(userData.validLogin)
                .end((err, res) => {
                    jwtToken = res.body.data;
                    expect(res.statusCode).to.be.equal(HttpStatus.OK);
                    expect(res.body.data).to.be.not.null;
                    done();
                });

        });

        it('given uer when denied login should return status 401', (done) => {
            request(app)
                .post('/api/v1/users/login')
                .send(userData.invalidLogin)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.UNAUTHORIZED);
                    done();
                });
        });
    });

    //forget password test
    describe('POST /forgerPassword', () => {
        it('given user when provides valid email should get mail should return status 200', (done) => {
            request(app)
                .post('/api/v1/users/forgetPassword')
                .send(userData.forgetPassword)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.OK);
                    done();
                });
        });

        it('given user when provides invalid email should return status 500', (done) => {
            request(app)
                .post('/api/v1/users/forgetPassword')
                .send(userData.invalidEmail)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    done();
                });
        });
    });

    //reset password test
    // describe('POST /resetPassword', () => {
    //     it('given user when able to reset password should return status 200', (done) => {
    //         request(app)
    //             .post('/api/v1/users/resetPassword/:token')
    //             .send(userData.resetPassword)
    //             .end((err, res) => {

    //                 expect(res.statusCode).to.be.equal(HttpStatus.OK);
    //                 done();
    //             });
    //     });
    // });

    // create note test
    describe('POST /createNote', () => {
        it('given new note when added should return status 201', (done) => {
            request(app)
                .post('/api/v1/notes/createNote')
                .set('token', `${jwtToken}`)
                .send(noteData.validNote)
                .end((err, res) => {
                    _id = res.body.data._id;
                    expect(res.statusCode).to.be.equal(HttpStatus.CREATED);
                    done();
                });
        });

        it('given user when not authenticated should return status 401', (done) => {
            invalidToken = `${jwtToken}`.slice(12);
            request(app)
                .post('/api/v1/notes/createNote')
                .set('token', `${invalidToken}`)
                .send(noteData.validNote)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.UNAUTHORIZED);
                    done();
                });
        });

        it('given user when authenticated and not able to add note should return status 500', (done) => {
            request(app)
                .post('/api/v1/notes/createNote')
                .set('token', `${jwtToken}`)
                .send(noteData.invalidNote)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    done();
                });
        });
    });

    //Get all notes test
    describe('GET /getAllNotes', () => {
        it('given request when notes fetched successfully should return status 200', (done) => {
            request(app)
                .get('/api/v1/notes/getAllNotes')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.OK);
                    done();
                });
        });

        it('given user when not able to fetch notes should return status 404', (done) => {
            request(app)
                .get('/api/v1/notes/getAllNote')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    //Get single note test
    describe('GET /getNote', () => {
        it('given request when note fetched successfully should return status 200', (done) => {
            request(app)
                .get('/api/v1/notes/getNote/' + `${_id}`)
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.OK);
                    done();
                });
        });

        it('given user when not able to fetch a note should return status 404', (done) => {
            request(app)
                .get('/api/v1/notes/getNote/')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    //update note test
    describe('PUT /update', () => {
        it('given user when able to update a note should return status 202', (done) => {
            request(app)
                .put('/api/v1/notes/update/' + `${_id}`)
                .set('token', `${jwtToken}`)
                .send(noteData.validUpdate)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.ACCEPTED);
                    done();
                });
        });

        it('given user when not able to update a note should return status 500', (done) => {
            request(app)
                .put('/api/v1/notes/update/' + `${_id}`)
                .set('token', `${jwtToken}`)
                .send(noteData.invalidUpdate)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
                    done();
                });
        });
    });

    //archieve notes test
    describe('PUT /archieve', () => {
        it('given user when able to archieve a note should return status 202', (done) => {
            request(app)
                .put('/api/v1/notes/archieve/' + `${_id}`)
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.ACCEPTED);
                    done();
                });
        });

        it('given user when not able to archieve a note should return status 404', (done) => {
            request(app)
                .put('/api/v1/notes/archieve/')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    //get archieve notes test
    describe('GET /archievedNotes', () => {
        it('given user when able to get archieved notes should return status 200', (done) => {
            request(app)
                .get('/api/v1/notes/archievedNotes')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.OK);
                    done();
                });
        });

        it('given user when not able to get archieved notes should return status 404', (done) => {
            request(app)
                .get('/api/v1/notes/getArchievedNotes')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    //trash notes test
    describe('PUT /trash', () => {
        it('given user when able to send a note to trash should return status 202', (done) => {
            request(app)
                .put('/api/v1/notes/trash/' + `${_id}`)
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.ACCEPTED);
                    done();
                });
        });

        it('given user when not able to send a note to trash should return status 404', (done) => {
            request(app)
                .put('/api/v1/notes/trash/')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    //get trashed notes test
    describe('GET /trashedNotes', () => {
        it('given user when able to get trasged notes should return status 200', (done) => {
            request(app)
                .get('/api/v1/notes/trashedNotes')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.OK);
                    done();
                });
        });

        it('given user when not able to get trasged notes should return status 404', (done) => {
            request(app)
                .get('/api/v1/notes/getTrashedNotes')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });

    //delete note test
    describe('DELETE /delete', () => {
        it('given user when able to delete a note should return status 202', (done) => {
            request(app)
                .delete('/api/v1/notes/delete/' + `${_id}`)
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.ACCEPTED);
                    done();
                });
        });

        it('given user when not able to delete a note should return status 404', (done) => {
            request(app)
                .delete('/api/v1/notes/delete/')
                .set('token', `${jwtToken}`)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(HttpStatus.NOT_FOUND);
                    done();
                });
        });
    });
});