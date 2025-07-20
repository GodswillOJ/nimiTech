const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:10000/api/careers';
const TEST_FILE_PATH = path.join(__dirname, 'test-files');

// Ensure test files directory exists
if (!fs.existsSync(TEST_FILE_PATH)) {
  fs.mkdirSync(TEST_FILE_PATH, { recursive: true });
}

// Create a test PDF file for testing
const createTestPDF = (filename) => {
  const testPDFContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Document) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

  const filePath = path.join(TEST_FILE_PATH, filename);
  fs.writeFileSync(filePath, testPDFContent);
  return filePath;
};

// Test resume upload
const testResumeUpload = async () => {
  console.log('\\n🧪 Testing Resume Upload...');
  
  try {
    // Create test PDF file
    const testFilePath = createTestPDF('test-resume.pdf');
    
    // Create form data
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(testFilePath), {
      filename: 'test-resume.pdf',
      contentType: 'application/pdf'
    });

    // Make request
    const response = await axios.post(`${BASE_URL}/upload-resume`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 10000
    });

    console.log('✅ Resume upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Cleanup
    fs.unlinkSync(testFilePath);
    
    return response.data;
  } catch (error) {
    console.log('❌ Resume upload failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
};

// Test cover letter upload
const testCoverLetterUpload = async () => {
  console.log('\\n🧪 Testing Cover Letter Upload...');
  
  try {
    // Create test PDF file
    const testFilePath = createTestPDF('test-cover-letter.pdf');
    
    // Create form data
    const formData = new FormData();
    formData.append('coverLetter', fs.createReadStream(testFilePath), {
      filename: 'test-cover-letter.pdf',
      contentType: 'application/pdf'
    });

    // Make request
    const response = await axios.post(`${BASE_URL}/upload-cover-letter`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 10000
    });

    console.log('✅ Cover letter upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Cleanup
    fs.unlinkSync(testFilePath);
    
    return response.data;
  } catch (error) {
    console.log('❌ Cover letter upload failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
    throw error;
  }
};

// Test server connectivity
const testServerConnectivity = async () => {
  console.log('🔍 Testing server connectivity...');
  
  try {
    const response = await axios.get(`${BASE_URL}/jobs`, { timeout: 5000 });
    console.log('✅ Server is reachable!');
    return true;
  } catch (error) {
    console.log('❌ Server connectivity failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting Upload Endpoint Tests');
  console.log('==================================');
  
  try {
    // Test server connectivity first
    const isServerReachable = await testServerConnectivity();
    if (!isServerReachable) {
      console.log('\\n❌ Cannot proceed with tests - server is not reachable');
      process.exit(1);
    }

    // Test resume upload
    await testResumeUpload();
    
    // Test cover letter upload
    await testCoverLetterUpload();
    
    console.log('\\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.log('\\n💥 Test suite failed!');
    process.exit(1);
  } finally {
    // Cleanup test files directory
    if (fs.existsSync(TEST_FILE_PATH)) {
      fs.rmSync(TEST_FILE_PATH, { recursive: true, force: true });
    }
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testResumeUpload,
  testCoverLetterUpload,
  testServerConnectivity,
  runTests
};
