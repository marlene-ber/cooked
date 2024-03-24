// index.js

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require('./models/users');
const PostModel = require('./models/Post'); // Use lowercase "post" here
const multer = require("multer");
const session = require('express-session');
require('dotenv').config();
const axios = require('axios');
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


mongoose.connect("mongodb+srv://rachelaranjo:Lancasteruniversity.17@cluster0.8jvshet.mongodb.net/recipe");

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});



const ReportModel = require('./models/Report');


// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",  // Specify the destination folder for uploaded files
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
app.use(express.static('uploads'));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Google OAuth route
app.get('/auth/google', (req, res) => {
 
  console.log('Handling /auth/google route');



const googleAuthUrl = "https://accounts.google.com/o/oauth2/auth" +
  '?client_id=' + process.env.GOOGLE_CLIENT_ID +
  '&redirect_uri=' + process.env.GOOGLE_CALLBACK_URL +
  '&response_type=code&scope=profile email';

console.log('Redirecting to Google OAuth URL:', googleAuthUrl);

res.redirect(googleAuthUrl);
});

//Google Auth

app.get('/auth/google/callback', async (req, res) => {
try {
  console.log('Received Google OAuth callback with query parameters:', req);

  const code = req.query.code;
  console.log('Received Google OAuth callback with code:', code);


  const response = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: 'authorization_code',
  });

  console.log('Google OAuth Token Exchange Response:', response.data);

  const accessToken = response.data.access_token;

  console.log('Access Token:', accessToken);

  const profileResponse = await axios.get('https://people.googleapis.com/v1/people/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profile = profileResponse.data;

  console.log('Google authentication successful. User profile:', profile);

  res.redirect('/');
} catch (error) {
  console.error('Error during Google OAuth callback:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});


app.post('/googleLogin', (req, res) => {

console.log('Received Google login callback:', req.body);


res.status(200).json({ success: true, message: 'Google login callback handled successfully' });
});




// Find ObjectID of user
app.post('/userobjectid', async (req, res) => {
  const { username } = req.body;

  try {
    
    const user = await User.findOne({ username });
    
    if (user) {
      res.status(200).json({ userObjectId: user._id });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Create post
app.post('/createpost', upload.single('image'), async (req, res) => {
  console.log('Reached /createpost route');
  try {
    const { caption , name   , keywords , ingredients} = req.body;
    const image = req.file.path;

    // Access the username from the request headers
    const username = req.headers.username;

    console.log('Caption:', caption);
    console.log('Name:', name);
    console.log('Username:', username);
    console.log('Image path:', image);
    console.log('Keywords:', keywords);
    console.log('Ingredients:', ingredients);

    const user = await UserModel.findOne({ username });

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const newPost = await PostModel.create({ name , caption,keywords, image,ingredients, user: user._id });

    // Update the user document to include a reference to the newly created post
    await UserModel.findByIdAndUpdate(user._id, { $push: { posts: newPost._id } });

    console.log('Post created successfully:', newPost);

    res.json({ success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


// Fetch usernames
app.post('/usernames', async (req, res) => {
  try {
    const { userObjectIds } = req.body;

    if (!userObjectIds || !Array.isArray(userObjectIds) || userObjectIds.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty userObjectIds array" });
    }

   
    const usernames = await UserModel.find({ _id: { $in: userObjectIds } }, 'username');

    const usernameMap = {};
    usernames.forEach(user => {
      usernameMap[user._id.toString()] = user.username;
    });

    res.json(usernameMap);
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Show all posts
app.get('/posts/all', async (req, res) => {
  try {
    const allPosts = await PostModel.find();

    res.json({ posts: allPosts });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Delete Account
app.delete('/deleteAccount/:username', async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL parameters

    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {

      return res.status(404).json({ success: false, message: "User not found" });
    }


    await UserModel.findByIdAndDelete(user._id);
    await PostModel.deleteMany({ user: user._id });

    console.log('User account deleted successfully:', username);

    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Fetch user profile by username
app.get('/user-profile/:username', async (req, res) => {
  const username = req.params.username;
  try {

      const user = await UserModel.findOne({ username });

      if (!user) {
          return res.status(404).render('errorPage', { message: "User not found" });
      }

      
      const followersCount = await UserModel.countDocuments({ following: user._id });

    
      let socialChefBadge = null;
      let popularPlateBadge = null;
      let firstPostBadge = null;

      // Logic for "SocialChef" badge
      if (followersCount > 12) {
          socialChefBadge = '/uploads/SocialChef.jpg';
      }

      // Logic for "PopularPlate" badge
      const hasPopularPost = await PostModel.findOne({ user: user._id, "likes.2": { $exists: true } });
      if (hasPopularPost) {
          popularPlateBadge = '/uploads/PopularPlate.jpg';
      }

      // Logic for "FirstPost" badge
      const userPostsCount = await PostModel.countDocuments({ user: user._id });
      if (userPostsCount > 0) {
          firstPostBadge = '/uploads/FirstPost.jpg';
      }

      // Render the profile page with badge information
      res.render('user-profile', { user, badges: { socialChefBadge, popularPlateBadge, firstPostBadge } });
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).render('errorPage', { message: "Internal Server Error" });
  }
});




    


// Fetch users by id
app.get('/http://localhost:3001/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('followers');
    const followersCount = user.followers.length; // Assumes followers is an array
    res.json({ ...user._doc, followersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Fetch user data
app.post('/userdata', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UserModel.findOne({ username }).lean(); // Use .lean() for faster execution if you're only reading data

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    const followersCount = user.followers ? user.followers.length : 0;
    const hasSocialChef = user.achievements && user.achievements.includes("SocialChef");
    if (followersCount > 12 && !hasSocialChef) {
      user.achievements.push("SocialChef");
      
      await UserModel.updateOne({ _id: user._id }, { $push: { achievements: "SocialChef" } });
    }

   
    const posts = await PostModel.find({ user: user._id });
    const hasPopularPlate = user.achievements && user.achievements.includes("PopularPlate");
    const eligibleForPopularPlate = posts.some(post => post.likes.length > 1);
    
    if (eligibleForPopularPlate && !hasPopularPlate) {
      await UserModel.updateOne({ _id: user._id }, { $push: { achievements: "PopularPlate" } });
      user.achievements.push("PopularPlate"); 
    }

    res.json({ success: true, user: user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Check existing user for login
app.post('/checkExisting', async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.json({ exists: true });
    }


    res.json({ exists: false });
  } catch (error) {
    console.error("Error checking existing user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//sign up
app.post('/signup', (req, res) => {
  UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});


app.post('/userdata', async (req, res) => {
  try {
    const { username } = req.body; 

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UserModel.findOne({ username });

    if (user) {
      res.json({ success: true, user: { ...user.toObject(), pfp: user.pfp } });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, password });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// fetch posts
app.post('/posts', async (req, res) => {
  try {
    const { username } = req.body; // Extract username from request body

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await PostModel.find({ user: user._id });

    res.json({ success: true, posts: userPosts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch following users posts
app.post('/posts/following', async (req, res) => {
  try {
    const { following } = req.body; // Extract the array of user IDs from the request body

    if (!following || !Array.isArray(following) || following.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty following array" });
    }

    const userPosts = await PostModel.find({ user: { $in: following } });


    const userIds = userPosts.map(post => post.user);


    const usernamesResponse = await axios.post("http://localhost:3001/usernames", {
      userObjectIds: userIds,
    });


    const postsWithUsernames = userPosts.map(post => ({
      ...post.toObject(),
      username: usernamesResponse.data[post.user],
    }));

    res.json({ success: true, posts: postsWithUsernames });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//fetch followers
app.get('/followers/:username', async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL parameters

    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      // User not found
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const followers = await UserModel.find({ following: user._id });

    const followerUsernames = followers.map(follower => follower.username);

    console.log('Followers of user', username, ':', followerUsernames);

    res.json({ success: true, followers: followerUsernames });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/followersarray", async (req, res) => {
  try {
    const { username } = req.body;

    
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.populate("followers").execPopulate();

    res.json({ followersDetails: user.followers });
  } catch (error) {
    console.error("Error fetching followers details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//like array
app.post('/likepost', async (req, res) => {
  try {
      const { postId, userId } = req.body;
      
    
      const post = await PostModel.findById(postId);
      

      const index = post.likes.indexOf(userId);
      if (index !== -1) {
         
          post.likes.splice(index, 1);
      } else {

          post.likes.push(userId);
      }
      

      await post.save();
      

      res.json({ success: true });
  } catch (error) {

      console.error("Error liking/unliking post:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//edit caption
app.post('/updatecaption', async (req, res) => {
  try {
    const { postId, newCaption } = req.body;


    const updatedPost = await PostModel.findByIdAndUpdate(postId, { caption: newCaption }, { new: true });

    res.json({ success: true, updatedPost });
  } catch (error) {
    console.error("Error updating caption:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//rate and review
app.post('/rateandreview', async (req, res) => {
  try {
      const { postId, userId, rating, review } = req.body;


      const post = await PostModel.findById(postId);

      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }


      const existingRatingIndex = post.ratings.findIndex(r => r.user.equals(userId));
      if (existingRatingIndex !== -1) {
        
          post.ratings[existingRatingIndex].rating = rating;
      } else {
        
          post.ratings.push({ user: userId, rating: rating });
      }

   
      post.reviews.push({ reviewText: review, user: userId });


      await post.save();

    
      res.json({ success: true });
  } catch (error) {

      console.error("Error posting rating and review:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


//popular posts
app.get('/posts/popular', async (req, res) => {
  try {
    const popularPosts = await PostModel.find({ 'likes.1': { $exists: true } }); // Finds posts with more than one like
    res.json(popularPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




//delete account
app.delete('/deleteAccount/:username', async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL parameters

 
    const user = await UserModel.findOne({ username });

    if (!user) {

      
      return res.status(404).json({ success: false, message: "User not found" });
    }


    await UserModel.findByIdAndDelete(user._id);
    await PostModel.deleteMany({ user: user._id });

    console.log('User account deleted successfully:', username);

    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/usernames', async (req, res) => {
  try {
    const { userObjectIds } = req.body;

    if (!userObjectIds || !Array.isArray(userObjectIds) || userObjectIds.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty userObjectIds array" });
    }

    // Assuming you have a User model with a 'username' field
    const usernames = await UserModel.find({ _id: { $in: userObjectIds } }, 'username');

    // Map user IDs to usernames
    const usernameMap = {};
    usernames.forEach(user => {
      usernameMap[user._id.toString()] = user.username;
    });

    res.json(usernameMap);
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get('/posts/all', async (req, res) => {
  try {
    const allPosts = await PostModel.find();

    res.json({ posts: allPosts });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/posts', async (req, res) => {
  try {
    const { username } = req.body; // Extract username from request body

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await PostModel.find({ user: user._id });

    res.json({ success: true, posts: userPosts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/posts/following', async (req, res) => {
  try {
    const { following } = req.body; // Extract the array of user IDs from the request body

    if (!following || !Array.isArray(following) || following.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty following array" });
    }

    const userPosts = await PostModel.find({ user: { $in: following } });

    // Extract user IDs from the fetched posts
    const userIds = userPosts.map(post => post.user);

    // Fetch usernames associated with user IDs
    const usernamesResponse = await axios.post("http://localhost:3001/usernames", {
      userObjectIds: userIds,
    });

    // Map usernames to posts
    const postsWithUsernames = userPosts.map(post => ({
      ...post.toObject(),
      username: usernamesResponse.data[post.user],
    }));

    res.json({ success: true, posts: postsWithUsernames });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Fetch user followers
app.get('/followers/:username', async (req, res) => {
  try {
    const { username } = req.params; 

    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      // User not found
      return res.status(404).json({ success: false, message: "User not found" });
    }


    const followers = await UserModel.find({ following: user._id });

    const followerUsernames = followers.map(follower => follower.username);

    console.log('Followers of user', username, ':', followerUsernames);

    res.json({ success: true, followers: followerUsernames });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


 // Fetch followers array
app.post("/followersarray", async (req, res) => {
  try {
    const { username } = req.body;

    // Fetch the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    await user.populate("followers").execPopulate();


    res.json({ followersDetails: user.followers });
  } catch (error) {
    console.error("Error fetching followers details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Toggle bookmark status of a post
app.post('/togglebookmark', async (req, res) => {
  try {
    const { postId, userId } = req.body;
    console.log('Received toggle bookmark request:', { postId, userId });

    // Find the user by userId
    const user = await UserModel.findById(userId);
    console.log('User found:', user);

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }


    if (!Array.isArray(user.saved)) {
      user.saved = [];
    }

  
    const isSaved = user.saved.includes(postId);
    console.log('Is post already saved?', isSaved);

    let updatedSavedPosts;
    if (isSaved) {

      updatedSavedPosts = user.saved.filter(savedPostId => savedPostId !== postId);
    } else {

      updatedSavedPosts = [...user.saved, postId];
    }

    
    await UserModel.findByIdAndUpdate(userId, { saved: updatedSavedPosts });
    console.log('Saved posts updated successfully');

    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling saved post:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Fetch saved posts of a user
app.post('/savedposts', async (req, res) => {
  try {
    const { username } = req.body; // Extract username from request body

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

 
    const savedPostIds = user.saved;

  
    const savedPosts = await PostModel.find({ _id: { $in: savedPostIds } });

    res.json({ success: true, savedPosts });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

 // Update user profile picture
app.post('/updateProfilePic', upload.single('profilePic'), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "No profile picture uploaded." });
  }

  const { username } = req.body;
  const profilePicUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    const user = await UserModel.findOneAndUpdate({ username }, { pfp: profilePicUrl }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Profile picture updated successfully", profilePicUrl });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


app.get('/posts/recent', async (req, res) => {
  try {
    const recentPosts = await PostModel.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(8); // Optional: limits to the 10 most recent posts
    res.json(recentPosts);
  } catch (error) {
    console.error("Failed to fetch recent posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch most followed users
app.get('/users/most-followed', async (req, res) => {
  try {
    const mostFollowedUsers = await UserModel.find().sort({ followers: -1 }).limit(10);
    res.json({ users: mostFollowedUsers });
  } catch (error) {
    console.error("Error fetching most followed users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// File a report
app.post('/report/file', async (req, res) => {
  try {
    const { filedBy, filedAgainst, complaint, itemType, itemNumber } = req.body;
    const newReport = new Report({
      filedBy,
      filedAgainst,
      complaint,
      itemType,
      itemNumber,
    });
    await newReport.save();
    console.log('Report sent.');
  } catch (error) {
    console.error('Error filing report. ', error);
    res.status(500).json({ error: 'An error occurred while filing the report' });
  } 
})

// Display all reports
app.get('/report/display', async (req, res) => {
  try {
    const allReports = await Report.find();
    res.json({ reports: allReports });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Resolve a report
app.post('/report/resolve', async (req, res) => {
  try {
      const { reportId, resolved } = req.body;
      const newResolved = !resolved;
      const updatedReport = await Report.findByIdAndUpdate(reportId, { resolved: newResolved }, { new: true });
      res.json({ success: true, updatedReport });
  } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

 
app.post('/fileReport', async (req, res) => {
  try {
    const { filedBy, filedAgainst, complaint, itemType, itemNumber } = req.body;

    // Create a new report
    const newReport = new Reports({
      filedBy,
      filedAgainst,
      complaint,
      itemType,
      itemNumber,
    });

  
    await newReport.save();

    res.status(201).json({ message: 'Report filed successfully' });
  } catch (error) {
    console.error('Error filing report:', error);
    res.status(500).json({ error: 'An error occurred while filing the report' });
  }
});


// Server Listening
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

