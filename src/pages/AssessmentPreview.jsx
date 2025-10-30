import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { db } from '../db/dexieDB';

const AssessmentPreview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Fetch the saved assessment data
  const { data: assessment, isLoading, error } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: async () => {
      const assessmentData = await db.assessments.get(parseInt(jobId));
      if (!assessmentData) {
        throw new Error('Assessment not found. Please build the assessment first.');
      }
      return assessmentData;
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Set timer based on assessment duration
  useEffect(() => {
    if (assessment?.duration) {
      setTimeLeft(assessment.duration * 60); // Convert minutes to seconds
    }
  }, [assessment]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleAutoSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setIsSubmitted(true);
    setShowConfirmation(false);
    console.log('Assessment submitted with answers:', answers);
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Calculate total questions
  const totalQuestions = assessment?.sections?.reduce((total, section) =>
    total + (section.questions?.length || 0), 0
  ) || 0;

  // Get current question data
  const getCurrentQuestion = () => {
    if (!assessment?.sections) return null;

    let questionCount = 0;
    for (const section of assessment.sections) {
      for (const question of section.questions || []) {
        if (questionCount === currentQuestion) {
          return { ...question, sectionTitle: section.title };
        }
        questionCount++;
      }
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Not Built</h2>
          <p className="text-gray-600 mb-6">
            {error?.message || 'This assessment has not been built yet.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/assessments"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Assessments
            </Link>
            <Link
              to={`/assessments/builder/${jobId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Build Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Completed!</h1>
            <p className="text-gray-600 mb-6">Thank you for completing the assessment.</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Your Answers Summary</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {Object.entries(answers).map(([questionId, answer], index) => (
                  <div key={questionId} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <p className="font-medium text-gray-900 text-sm mb-2">
                      Q{index + 1}: {questionId}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Your answer:</strong> {JSON.stringify(answer)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/assessments"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              Back to Assessments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available in this assessment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h1>
              <p className="text-gray-600">{assessment.description}</p>
              <p className="text-sm text-gray-500 mt-2">Section: {currentQuestionData.sectionTitle}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${timeLeft < 300 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-blue-100 text-blue-800'
                }`}>
                ⏱️ Time Left: {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Assessment Progress</span>
            <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Question {currentQuestion + 1}
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {currentQuestionData.type?.replace('_', ' ').toUpperCase() || 'QUESTION'}
            </span>
          </div>

          <p className="text-gray-800 mb-8 text-lg leading-relaxed font-medium">
            {currentQuestionData.question}
          </p>

          {/* Multiple Choice Question */}
          {currentQuestionData.type === 'single-choice' && (
            <div className="space-y-3">
              {(currentQuestionData.options || []).map((option, index) => (
                <label key={index} className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group">
                  <input
                    type="radio"
                    name={`question-${currentQuestionData.id}`}
                    value={option}
                    checked={answers[currentQuestionData.id] === option}
                    onChange={() => handleAnswerChange(currentQuestionData.id, option)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <span className="text-gray-700 flex-1 group-hover:text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Multiple Choice (Multi-select) */}
          {currentQuestionData.type === 'multi-choice' && (
            <div className="space-y-3">
              {(currentQuestionData.options || []).map((option, index) => (
                <label key={index} className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group">
                  <input
                    type="checkbox"
                    checked={Array.isArray(answers[currentQuestionData.id]) && answers[currentQuestionData.id].includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(answers[currentQuestionData.id]) ? answers[currentQuestionData.id] : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(opt => opt !== option);
                      handleAnswerChange(currentQuestionData.id, newValues);
                    }}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                  />
                  <span className="text-gray-700 flex-1 group-hover:text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Text Questions */}
          {(currentQuestionData.type === 'short-text' || currentQuestionData.type === 'long-text') && (
            <div>
              <textarea
                rows={currentQuestionData.type === 'long-text' ? 4 : 2}
                value={answers[currentQuestionData.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                placeholder="Your answer..."
                maxLength={currentQuestionData.validation?.maxLength}
              />
              {currentQuestionData.validation?.maxLength && (
                <div className="text-sm text-gray-500 mt-2 text-right">
                  {answers[currentQuestionData.id]?.length || 0}/{currentQuestionData.validation.maxLength} characters
                </div>
              )}
            </div>
          )}

          {/* Numeric Question */}
          {currentQuestionData.type === 'numeric' && (
            <input
              type="number"
              value={answers[currentQuestionData.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter a number"
              min={currentQuestionData.validation?.min}
              max={currentQuestionData.validation?.max}
            />
          )}

          {/* File Upload Question */}
          {currentQuestionData.type === 'file-upload' && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <p className="text-gray-600 mb-4">File upload question - in a real scenario, this would handle file uploads</p>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleAnswerChange(currentQuestionData.id, {
                      fileName: file.name,
                      fileSize: file.size,
                      fileType: file.type
                    });
                  }
                }}
                className="mx-auto"
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium w-full sm:w-auto justify-center"
          >
            Previous Question
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-blue-800 font-semibold mb-2">Assessment Preview Mode</p>
              <p className="text-blue-600 text-sm">
                This is a preview of how candidates will experience the assessment.
                In a real scenario, this would be a timed test with proper validation, proctoring, and secure submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Assessment?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your assessment? You won't be able to make changes after submission.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelSubmit}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentPreview;