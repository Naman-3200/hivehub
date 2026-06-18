// import mongoose from "mongoose";

// export async function connectDB() {
//   try {
//     const connection = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB connected ${connection.connection.host}`);
//   } catch (error) {
//     console.log("Data base connection failed!", error);
//     process.exit(1);
//   }
// }






// // Test script to diagnose MongoDB connection issues
// import mongoose from "mongoose";
// import { promisify } from 'util';
// import { exec } from 'child_process';

// const execAsync = promisify(exec);

// // Your connection string
// const MONGODB_URI = "mongodb+srv://namanp2300_db_user:Shivparvati@1@cluster0.zwrnokf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// async function testConnection() {
//   console.log("🔍 Starting MongoDB connection diagnostics...\n");
  
//   // 1. Check your current IP
//   try {
//     console.log("1. Checking your current IP address:");
//     const { stdout } = await execAsync('curl -s https://api.ipify.org');
//     console.log(`   Your current IP: ${stdout.trim()}\n`);
//   } catch (error) {
//     console.log("   Could not fetch IP address\n");
//   }

//   // 2. Test DNS resolution
//   try {
//     console.log("2. Testing DNS resolution:");
//     const { stdout } = await execAsync('nslookup cluster0.zwrnokf.mongodb.net');
//     console.log("   DNS resolution: ✅ SUCCESS");
//     console.log(`   Resolved addresses found\n`);
//   } catch (error) {
//     console.log("   DNS resolution: ❌ FAILED");
//     console.log("   This might be a network/DNS issue\n");
//   }

//   // 3. Test basic connectivity
//   console.log("3. Testing basic connectivity to MongoDB servers:");
//   const servers = [
//     'ac-7okleok-shard-00-00.zwrnokf.mongodb.net',
//     'ac-7okleok-shard-00-01.zwrnokf.mongodb.net',
//     'ac-7okleok-shard-00-02.zwrnokf.mongodb.net'
//   ];

//   for (const server of servers) {
//     try {
//       await execAsync(`ping -n 1 ${server}`, { timeout: 5000 });
//       console.log(`   ${server}: ✅ REACHABLE`);
//     } catch (error) {
//       console.log(`   ${server}: ❌ UNREACHABLE`);
//     }
//   }
//   console.log();

//   // 4. Test MongoDB connection with different options
//   console.log("4. Testing MongoDB connection with various configurations:\n");
  
//   const connectionConfigs = [
//     {
//       name: "Basic connection",
//       uri: MONGODB_URI,
//       options: {}
//     },
//     {
//       name: "Connection with extended timeout",
//       uri: MONGODB_URI,
//       options: {
//         serverSelectionTimeoutMS: 10000,
//         socketTimeoutMS: 45000,
//         connectTimeoutMS: 10000,
//       }
//     },
//     {
//       name: "Connection with SSL and retry options",
//       uri: MONGODB_URI,
//       options: {
//         serverSelectionTimeoutMS: 10000,
//         socketTimeoutMS: 45000,
//         connectTimeoutMS: 10000,
//         maxPoolSize: 10,
//         retryWrites: true,
//         retryReads: true
//       }
//     }
//   ];

//   for (const config of connectionConfigs) {
//     console.log(`   Testing: ${config.name}`);
//     try {
//       const connection = await mongoose.connect(config.uri, config.options);
//       console.log(`   ✅ SUCCESS: Connected to ${connection.connection.host}`);
//       await mongoose.disconnect();
//       console.log(`   ✅ Disconnected cleanly\n`);
//       return; // If one works, we're done
//     } catch (error) {
//       console.log(`   ❌ FAILED: ${error.message}\n`);
//       await mongoose.disconnect().catch(() => {}); // Clean up any partial connections
//     }
//   }

//   // 5. Additional diagnostics
//   console.log("5. Additional Information:");
//   console.log(`   Node.js version: ${process.version}`);
//   console.log(`   Platform: ${process.platform}`);
//   console.log(`   Architecture: ${process.arch}`);
  
//   // Check if running behind corporate firewall/proxy
//   console.log("\n6. Potential Issues to Check:");
//   console.log("   • Corporate firewall blocking port 27017");
//   console.log("   • VPN interfering with connections");
//   console.log("   • Antivirus blocking connections");
//   console.log("   • MongoDB Atlas cluster might be paused or having issues");
//   console.log("   • Database user credentials might be incorrect");
// }

// // Run the test
// testConnection().catch(console.error);








import mongoose from "mongoose";

export async function connectDB() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(`Connection string: ${process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      
      // Retry and pool settings
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
      
      // Additional stability options
      heartbeatFrequencyMS: 10000,
      
      // Remove unsupported buffer settings
    });
    
    console.log(`✅ MongoDB connected successfully!`);
    console.log(`   Host: ${connection.connection.host}`);
    console.log(`   Database: ${connection.connection.name}`);
    console.log(`   Port: ${connection.connection.port}`);
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    return connection;
    
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    
    // Provide specific troubleshooting based on error type
    if (error.name === 'MongooseServerSelectionError') {
      console.error("\n🔧 Troubleshooting steps:");
      console.error("1. Check if your IP is whitelisted in MongoDB Atlas");
      console.error("2. Verify your database username and password");
      console.error("3. Ensure your cluster is running and not paused");
      console.error("4. Check if you're behind a firewall blocking port 27017");
      console.error("5. Try connecting from a different network");
    }
    
    if (error.reason?.type === 'ReplicaSetNoPrimary') {
      console.error("\n🔧 ReplicaSet issue detected:");
      console.error("1. Your MongoDB cluster might be experiencing issues");
      console.error("2. Check MongoDB Atlas status page");
      console.error("3. Try again in a few minutes");
    }
    
    // Don't exit immediately in development
    if (process.env.NODE_ENV !== 'production') {
      console.error("\n⏳ Will retry connection in 5 seconds...");
      setTimeout(() => {
        connectDB();
      }, 5000);
    } else {
      process.exit(1);
    }
  }
}