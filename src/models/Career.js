const mongoose = require('mongoose')

const careerSchema = new mongoose.Schema(
  {
    position: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },

    personalInformation: {
      salutation: { type: String, trim: true },
      firstName: { type: String, required: true, trim: true },
      middleName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      placeOfBirth: { type: String, trim: true },
      maritalStatus: { type: String, trim: true },
      religion: { type: String, trim: true },
      nationality: { type: String, trim: true },
      email: { type: String, required: true, trim: true },
      mobileNumber: { type: String, required: true, trim: true },
    },

    presentAddress: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pinCode: { type: String, trim: true },
    },

    permanentAddress: {
      sameAsPresentAddress: { type: Boolean, default: false },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pinCode: { type: String, trim: true },
    },

    children: [
      {
        name: { type: String, trim: true },
        gender: { type: String, trim: true },
        age: { type: String, trim: true },
        presentClass: { type: String, trim: true },
        currentSchool: { type: String, trim: true },
      },
    ],

    familyInformation: {
      fatherName: { type: String, trim: true },
      fatherOccupation: { type: String, trim: true },
      motherName: { type: String, trim: true },
      motherOccupation: { type: String, trim: true },
      spouseName: { type: String, trim: true },
      spouseJobTransferable: { type: Boolean, default: false },
      spouseQualification: { type: String, trim: true },
      spouseProfession: { type: String, trim: true },
      spouseOrganization: { type: String, trim: true },
      spouseDesignation: { type: String, trim: true },
    },

    academicQualifications: [
      {
        qualification: { type: String, trim: true },
        mainSubjects: { type: String, trim: true },
        schoolOrCollege: { type: String, trim: true },
        boardOrUniversity: { type: String, trim: true },
        yearOfPassing: { type: String, trim: true },
        percentageOfMarks: { type: String, trim: true },
        division: { type: String, trim: true },
      },
    ],

    workExperiences: [
      {
        organizationName: { type: String, trim: true },
        fromDate: { type: String, trim: true },
        toDate: { type: String, trim: true },
        subjects: { type: String, trim: true },
        classes: { type: String, trim: true },
        otherResponsibilities: { type: String, trim: true },
      },
    ],

    totalExperience: {
      completedYears: { type: String, trim: true },
      teaching: { type: String, trim: true },
      administration: { type: String, trim: true },
      otherExperience: { type: String, trim: true },
    },

    currentJobInformation: {
      institutionName: { type: String, trim: true },
      address: { type: String, trim: true },
      contactNumber: { type: String, trim: true },
      presentOrPreviousDesignation: { type: String, trim: true },
      dateOfJoining: { type: String, trim: true },
      placeOfPosting: { type: String, trim: true },
      totalEarning: { type: String, trim: true },
      basicSalary: { type: String, trim: true },
      allowance: { type: String, trim: true },
      otherBenefits: { type: String, trim: true },
      underServiceBond: { type: Boolean, default: false },
      expectedSalary: { type: String, trim: true },
      computerProficiency: { type: String, trim: true },
    },

    documents: {
      resume: {
        fileId: { type: String },
        fileName: { type: String },
        viewLink: { type: String },
        directLink: { type: String },
      },
      passportPhoto: {
        fileId: { type: String },
        fileName: { type: String },
        viewLink: { type: String },
        directLink: { type: String },
      },
    },

    declaration: {
      agreed: { type: Boolean, default: false },
      submittedAt: { type: Date },
    },

    applicationStatus: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true, collection: 'career_applications' }
)

module.exports = mongoose.model('Career', careerSchema)
