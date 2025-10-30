
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { db } from '../db/dexieDB';

const AssessmentRuntimePage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Fetch the specific job data
  const { data: job, isLoading: jobLoading, error: jobError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const jobData = await db.jobs.get(parseInt(jobId));
      if (!jobData) {
        throw new Error('Job not found');
      }
      return jobData;
    },
    retry: 1,
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Show loading state
  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show error state if job not found
  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Not Found</h2>
          <p className="text-gray-600 mb-6">
            The assessment you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/assessments"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  // Get assessment data based on the actual job
  const getAssessmentData = () => {
    const baseData = {
      duration: 60,
      questions: []
    };

    // Use the actual job title from the database
    const jobTitle = job.title?.toLowerCase() || '';

    if (jobTitle.includes('frontend') || jobTitle.includes('developer')) {
      return {
        ...baseData,
        title: `${job.title} Assessment`,
        description: "This assessment tests your knowledge of modern frontend development practices, JavaScript, React, and CSS.",
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: "What is the correct way to create a React component?",
            options: [
              "function MyComponent() { return <div>Hello</div>; }",
              "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
              "const MyComponent = () => <div>Hello</div>;",
              "All of the above"
            ],
            correctAnswer: 3
          },
          {
            id: 2,
            type: 'multiple_choice',
            question: "Which hook is used to perform side effects in React?",
            options: [
              "useState",
              "useEffect",
              "useContext",
              "useReducer"
            ],
            correctAnswer: 1
          }
        ]
      };
    }

    // Default assessment for other job types
    return {
      ...baseData,
      title: `${job.title} Assessment`,
      description: "This assessment evaluates your skills and knowledge for this position.",
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: "Which quality is most important for this role?",
          options: [
            "Attention to detail",
            "Communication skills",
            "Technical expertise",
            "Problem-solving ability"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          type: 'text',
          question: "Describe your relevant experience for this position.",
          maxLength: 500
        }
      ]
    };
  };

  const assessmentData = getAssessmentData();

  // Rest of your component logic...
  // [Include all the timer, state management, and UI logic from the previous AssessmentPreview component]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{assessmentData.title}</h1>
              <p className="text-gray-600">{assessmentData.description}</p>
              <p className="text-sm text-gray-500 mt-2">Job: {job.title}</p>
            </div>
            {/* Timer and other UI elements */}
          </div>
        </div>
        {/* Rest of your component */}
      </div>
    </div>
  );
};

export default AssessmentRuntimePage;