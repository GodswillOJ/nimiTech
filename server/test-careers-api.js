const testCareersAPI = async () => {
  const baseURL = "http://localhost:10000/api/careers";

  try {
    console.log("Testing Careers API endpoints...\n");

    // Test 1: Get all jobs
    console.log("1. Testing GET /api/careers/jobs");
    const jobsRes = await fetch(`${baseURL}/jobs`);
    if (!jobsRes.ok) throw new Error(`Status ${jobsRes.status}`);
    const jobsData = await jobsRes.json();
    console.log(`✅ Status: ${jobsRes.status}`);
    console.log(`✅ Found ${jobsData.jobs.length} jobs`);
    console.log(`✅ Total jobs: ${jobsData.totalJobs}\n`);

    // Test 2: Get specific job
    if (jobsData.jobs.length > 0) {
      const firstJob = jobsData.jobs[0];
      console.log(`2. Testing GET /api/careers/jobs/${firstJob._id}`);
      const jobRes = await fetch(`${baseURL}/jobs/${firstJob._id}`);
      if (!jobRes.ok) throw new Error(`Status ${jobRes.status}`);
      const jobData = await jobRes.json();
      console.log(`✅ Status: ${jobRes.status}`);
      console.log(`✅ Job title: ${jobData.title}`);
      console.log(`✅ Department: ${jobData.department}\n`);
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
