const axios = require("axios");

const testCareersAPI = async () => {
  const baseURL = "http://localhost:10000/api/careers";

  try {
    console.log("Testing Careers API endpoints...\n");

    // Test 1: Get all jobs
    console.log("1. Testing GET /api/careers/jobs");
    const jobsResponse = await axios.get(`${baseURL}/jobs`);
    console.log(`✅ Status: ${jobsResponse.status}`);
    console.log(`✅ Found ${jobsResponse.data.jobs.length} jobs`);
    console.log(`✅ Total jobs: ${jobsResponse.data.totalJobs}\n`);

    // Test 2: Get specific job
    if (jobsResponse.data.jobs.length > 0) {
      const firstJob = jobsResponse.data.jobs[0];
      console.log(`2. Testing GET /api/careers/jobs/${firstJob._id}`);
      const jobResponse = await axios.get(`${baseURL}/jobs/${firstJob._id}`);
      console.log(`✅ Status: ${jobResponse.status}`);
      console.log(`✅ Job title: ${jobResponse.data.title}`);
      console.log(`✅ Department: ${jobResponse.data.department}\n`);
    }

    console.log("🎉 All tests passed! Careers API is working correctly.");
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
};

testCareersAPI();
