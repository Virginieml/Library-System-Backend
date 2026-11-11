
const Member = require("../models/Member");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// 1. Create a new member
exports.createMember = async (req, res) => {
    try {
        const { fullName, email, phone, membershipType, isActive } = req.body;

        // Validation
        if (!fullName || !email) {
            return res.status(400).json({
                message: "Full name and email are required"
            });
        }

        // Create a new Member object
        const newMember = new Member(
            fullName,
            email,
            phone,
            membershipType,
            isActive
        );

        // Save member to Firestore
        const docRef = await db.collection("members").add(
            newMember.toFirestore()
        );

        res.status(201).json({
            message: "Member created successfully",
            memberId: docRef.id
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating member",
            error: error.message
        });
    }
};


// 2. Get all members
exports.getAllMembers = async (req, res) => {
    try {
        const snapshot = await db.collection("members").get();

        const members = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(members);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching members",
            error: error.message
        });
    }
};


// 3. Get one member by ID
exports.getMemberById = async (req, res) => {
    try {
        const memberId = req.params.id;

        const doc = await db.collection("members").doc(memberId).get();

        if (!doc.exists) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.status(200).json({
            id: doc.id,
            ...doc.data()
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching member",
            error: error.message
        });
    }
};


// 4. Update a member
exports.updateMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const updatedData = req.body;

        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                message: "Please provide details to update"
            });
        }

        const memberRef = db.collection("members").doc(memberId);
        const doc = await memberRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        // Only allow these fields to be updated
        const allowedFields = [
            "fullName",
            "email",
            "phone",
            "membershipType",
            "isActive"
        ];

        const dataToUpdate = {};

        for (const field of allowedFields) {
            if (updatedData[field] !== undefined) {
                dataToUpdate[field] = updatedData[field];
            }
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        if (
            dataToUpdate.isActive !== undefined &&
            typeof dataToUpdate.isActive !== "boolean"
        ) {
            return res.status(400).json({
                message: "isActive must be true or false"
            });
        }

        await memberRef.update(dataToUpdate);

        res.status(200).json({
            message: "Member updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating member",
            error: error.message
        });
    }
};


// 5. Delete a member
exports.deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id;

        const memberRef = db.collection("members").doc(memberId);
        const doc = await memberRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        await memberRef.delete();

        res.status(200).json({
            message: "Member deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting member",
            error: error.message
        });
    }
};
