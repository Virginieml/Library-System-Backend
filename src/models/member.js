class Member {
    constructor(fullName, email, phone, membershipType, isActive = true) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.membershipType = membershipType;
        this.isActive = isActive;
        this.createdAt = new Date().toISOString();
    }

    // Convert the Member object into a format Firestore can store
    toFirestore() {
        return {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            membershipType: this.membershipType,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
}

module.exports = Member;