// usersSeeders.js

const mongoose = require('mongoose');
const faker = require('faker');
const UsersModel = require('./users'); // Assuming your Users model is in the same directory

mongoose.connect("mongodb+srv://rachelaranjo:Lancasteruniversity.17@cluster0.8jvshet.mongodb.net/recipe");

// Function to generate a fake user with followers and following
const generateFakeUser = async (existingUsers) => {
    const numFollowers = faker.datatype.number({ min: 0, max: 10 });
    const numFollowing = faker.datatype.number({ min: 0, max: 10 });

    // Ensure existingUsers is an array
    existingUsers = existingUsers || [];

    // Select distinct random users from existingUsers as followers and following
    const followers = Array.from({ length: numFollowers }, () => faker.random.arrayElement(existingUsers));
    const following = Array.from({ length: numFollowing }, () => faker.random.arrayElement(existingUsers));


    // Remove duplicates from followers and following arrays
    const uniqueFollowers = Array.from(new Set(followers.map(user => user ? user._id : null).filter(id => id)));
    const uniqueFollowing = Array.from(new Set(following.map(user => user ? user._id : null).filter(id => id)));

    const pfp = `https://picsum.photos/100/100?random=${Math.random()}`;

    // Create the new user
    const newUser = new UsersModel({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        pfp: pfp,
        createdAt: faker.date.past(),
        followers: uniqueFollowers,
        following: uniqueFollowing,
    });

    // Save the new user
    await newUser.save();

    // Update existing users with new followers and following
    for (const existingUser of existingUsers) {
        // If the existing user is a follower of the new user, update their following
        if (uniqueFollowers.includes(existingUser._id) && !existingUser.following.includes(newUser._id)) {
            existingUser.following.push(newUser._id);
            await existingUser.save();
        }
        // If the existing user is following the new user, update their followers
        if (uniqueFollowing.includes(existingUser._id) && !existingUser.followers.includes(newUser._id)) {
            existingUser.followers.push(newUser._id);
            await existingUser.save();
        }
    }

    // Log the number of followers for all users
    await Promise.all(existingUsers.map(async (user) => {
        console.log(`${user.username} has ${user.followers.length} followers.`);
        
        // Check if the user has more than 5 followers and add "popular" achievement
        if (user.followers.length > 5 && !user.achievements.includes('popular')) {
            // Assuming there is an 'achievements' field in the UsersModel schema
            user.achievements.push('popular');
            await user.save();
        }
    }));

    return newUser;
};

// Function to create and save fake users
const seedFakeUsers = async (numUsers) => {
    try {
        // Retrieve existing users
        const existingUsers = await UsersModel.find();

        for (let i = 0; i < numUsers; i++) {
            await generateFakeUser(existingUsers.slice()); // Clone existingUsers array
        }

        console.log(`${numUsers} fake users inserted successfully with followers/following relationships.`);
    } catch (error) {
        console.error('Error inserting fake users:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Call the function with the desired number of fake users
seedFakeUsers(14);