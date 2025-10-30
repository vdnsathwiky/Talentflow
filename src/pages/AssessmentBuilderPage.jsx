import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, Save, ArrowLeft, FileText, CheckSquare, Type, Hash, Upload, List, AlertCircle, Settings, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../db/dexieDB';

// Enhanced File Upload Utility
const getFileType = (file) => {
  const type = file.type;
  if (type === 'application/pdf') return 'PDF';
  if (type === 'application/msword') return 'DOC';
  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOCX';
  return 'Unknown';
};

const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  console.log('File details:', {
    name: file.name,
    type: file.type,
    size: file.size,
    allowed: allowedTypes.includes(file.type)
  });

  if (file.size > maxSize) {
    throw new Error('File too large (max 10MB)');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Only PDF, DOC, DOCX files are allowed. Your file type: ${file.type}`);
  }

  return true;
};

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileUpload = async (file) => {
  try {
    // Validate file
    validateFile(file);

    // Read file as base64
    const data = await readFileAsBase64(file);

    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      data: data,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Default validation based on question type
const getDefaultValidation = (type) => {
  switch (type) {
    case 'numeric':
      return { min: null, max: null, errorMessage: '' };
    case 'long-text':
      return { maxLength: 1000, errorMessage: '' };
    case 'short-text':
      return { maxLength: 255, errorMessage: '' };
    default:
      return {};
  }
};

// Enhanced QuestionEditorWithConditional Component
function QuestionEditorWithConditional({
  question,
  onChange,
  onDelete,
  allQuestions,
  sectionIndex,
  questionIndex
}) {
  const [showConditionalUI, setShowConditionalUI] = useState(false);
  const [showValidationUI, setShowValidationUI] = useState(false);

  const questionTypes = [
    { value: 'short-text', label: 'Short Text', icon: Type },
    { value: 'long-text', label: 'Long Text', icon: FileText },
    { value: 'single-choice', label: 'Single Choice', icon: CheckSquare },
    { value: 'multi-choice', label: 'Multiple Choice', icon: List },
    { value: 'numeric', label: 'Numeric', icon: Hash },
    { value: 'file-upload', label: 'File Upload', icon: Upload }
  ];

  const currentTypeIcon = questionTypes.find(t => t.value === question.type)?.icon || Type;
  const QuestionIcon = currentTypeIcon;

  const update = (key, value) => onChange({ ...question, [key]: value });

  const updateValidation = (field, value) => {
    const newValidation = {
      ...question.validation || {},
      [field]: value
    };
    update('validation', newValidation);
  };

  const updateConditionalLogic = (field, value) => {
    const newLogic = {
      ...question.conditionalLogic,
      [field]: value
    };
    update('conditionalLogic', newLogic);
  };

  const updateShowIf = (field, value) => {
    const newShowIf = {
      ...question.conditionalLogic.showIf,
      [field]: value
    };
    updateConditionalLogic('showIf', newShowIf);
  };

  // Get questions that appear BEFORE this one
  const availableQuestions = allQuestions.slice(0, questionIndex);

  // Get the target question for operator options
  const targetQuestion = availableQuestions.find(
    q => q.id === question.conditionalLogic?.showIf?.questionId
  );

  // Determine available operators based on target question type
  const getOperators = () => {
    if (!targetQuestion) return [];

    switch (targetQuestion.type) {
      case 'single-choice':
      case 'short-text':
        return [
          { value: 'equals', label: 'equals' },
          { value: 'not-equals', label: 'does not equal' }
        ];
      case 'multi-choice':
        return [
          { value: 'contains', label: 'contains' },
          { value: 'not-contains', label: 'does not contain' }
        ];
      case 'numeric':
        return [
          { value: 'equals', label: 'equals' },
          { value: 'greater-than', label: 'greater than' },
          { value: 'less-than', label: 'less than' }
        ];
      default:
        return [{ value: 'equals', label: 'equals' }];
    }
  };

  const getValidationUI = () => {
    switch (question.type) {
      case 'numeric':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Minimum
              </label>
              <input
                type="number"
                value={question.validation?.min || ''}
                onChange={(e) => updateValidation('min', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="No minimum"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Maximum
              </label>
              <input
                type="number"
                value={question.validation?.max || ''}
                onChange={(e) => updateValidation('max', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="No maximum"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Error Message
              </label>
              <input
                type="text"
                value={question.validation?.errorMessage || ''}
                onChange={(e) => updateValidation('errorMessage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Custom error message (optional)"
              />
            </div>
          </div>
        );

      case 'long-text':
      case 'short-text':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Maximum Length
              </label>
              <input
                type="number"
                value={question.validation?.maxLength || ''}
                onChange={(e) => updateValidation('maxLength', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder={question.type === 'long-text' ? '1000' : '255'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Error Message
              </label>
              <input
                type="text"
                value={question.validation?.errorMessage || ''}
                onChange={(e) => updateValidation('errorMessage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Custom error message (optional)"
              />
            </div>
          </div>
        );

      default:
        return (
          <p className="text-sm text-gray-500 text-center py-4">
            No validation options available for this question type.
          </p>
        );
    }
  };

  const hasValidation = () => {
    const val = question.validation || {};
    return val.min !== null || val.max !== null || val.maxLength > 0;
  };

  const operators = getOperators();

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm">
      {/* Question Header */}
      <div className="flex gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <QuestionIcon className="w-5 h-5 text-blue-600" />
        </div>
        <input
          value={question.question}
          onChange={(e) => update('question', e.target.value)}
          className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
          placeholder="Question text"
        />
        <button
          onClick={onDelete}
          className="p-2.5 hover:bg-red-50 rounded-lg text-red-600 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Question Type & Required */}
      <div className="flex gap-4 items-center mb-4">
        <select
          value={question.type}
          onChange={(e) => update('type', e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-medium"
        >
          {questionTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => update('required', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Required</span>
        </label>
      </div>

      {/* Options for choice questions */}
      {(question.type === 'single-choice' || question.type === 'multi-choice') && (
        <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
          <label className="text-sm font-semibold text-gray-700">Options:</label>
          {(question.options || []).map((option, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[idx] = e.target.value;
                  update('options', newOptions);
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                placeholder={`Option ${idx + 1}`}
              />
              <button
                onClick={() => {
                  const newOptions = question.options.filter((_, i) => i !== idx);
                  update('options', newOptions);
                }}
                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => update('options', [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`])}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        </div>
      )}

      {/* VALIDATION SECTION */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <button
          onClick={() => setShowValidationUI(!showValidationUI)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors mb-3"
        >
          <Settings className="w-4 h-4" />
          Validation Rules
          {hasValidation() && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
          )}
        </button>

        {showValidationUI && (
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            {getValidationUI()}

            {/* Validation Preview */}
            {(question.validation?.min !== null || question.validation?.max !== null || question.validation?.maxLength) && (
              <div className="p-3 bg-white border border-green-200 rounded-lg">
                <p className="text-xs font-semibold text-green-600 mb-1">Validation Preview:</p>
                <p className="text-sm text-gray-700">
                  {question.type === 'numeric' && (
                    <>
                      Must be {question.validation.min !== null ? `≥ ${question.validation.min}` : ''}
                      {question.validation.min !== null && question.validation.max !== null ? ' and ' : ''}
                      {question.validation.max !== null ? `≤ ${question.validation.max}` : ''}
                    </>
                  )}
                  {(question.type === 'long-text' || question.type === 'short-text') && question.validation?.maxLength && (
                    `Maximum ${question.validation.maxLength} characters`
                  )}
                  {question.validation?.errorMessage && (
                    <span className="block text-red-500 text-xs mt-1">
                      Error: {question.validation.errorMessage}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONDITIONAL LOGIC SECTION */}
      <div className="border-t-2 border-gray-200 pt-4 mt-4">
        <button
          onClick={() => setShowConditionalUI(!showConditionalUI)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors mb-3"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showConditionalUI ? 'rotate-180' : ''}`} />
          Conditional Logic
          {question.conditionalLogic?.enabled && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Active</span>
          )}
        </button>

        {showConditionalUI && (
          <div className="bg-blue-50 p-4 rounded-xl space-y-4">
            {/* Enable/Disable Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={question.conditionalLogic?.enabled || false}
                onChange={(e) => updateConditionalLogic('enabled', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable conditional display
              </span>
            </label>

            {question.conditionalLogic?.enabled && (
              <>
                {availableQuestions.length === 0 ? (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      No previous questions available. Add questions above this one to create conditions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 font-medium">
                      Show this question only if:
                    </p>

                    {/* Select Question */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Question
                      </label>
                      <select
                        value={question.conditionalLogic.showIf.questionId || ''}
                        onChange={(e) => updateShowIf('questionId', Number(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select a question...</option>
                        {availableQuestions.map((q, idx) => (
                          <option key={q.id} value={q.id}>
                            Q{idx + 1}: {q.question.substring(0, 50)}{q.question.length > 50 ? '...' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select Operator */}
                    {targetQuestion && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Condition
                        </label>
                        <select
                          value={question.conditionalLogic.showIf.operator}
                          onChange={(e) => updateShowIf('operator', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                        >
                          {operators.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Select/Enter Value */}
                    {targetQuestion && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Value
                        </label>
                        {(targetQuestion.type === 'single-choice') ? (
                          <select
                            value={question.conditionalLogic.showIf.value}
                            onChange={(e) => updateShowIf('value', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                          >
                            <option value="">Select value...</option>
                            {targetQuestion.options?.map((opt, idx) => (
                              <option key={idx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : targetQuestion.type === 'multi-choice' ? (
                          <select
                            value={question.conditionalLogic.showIf.value}
                            onChange={(e) => updateShowIf('value', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                          >
                            <option value="">Select value...</option>
                            {targetQuestion.options?.map((opt, idx) => (
                              <option key={idx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={targetQuestion.type === 'numeric' ? 'number' : 'text'}
                            value={question.conditionalLogic.showIf.value}
                            onChange={(e) => updateShowIf('value', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                            placeholder="Enter value..."
                          />
                        )}
                      </div>
                    )}

                    {/* Preview */}
                    {targetQuestion && question.conditionalLogic.showIf.value && (
                      <div className="p-3 bg-white border-2 border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-600 mb-1">Preview:</p>
                        <p className="text-sm text-gray-700">
                          Show when "<span className="font-semibold">{targetQuestion.question}</span>"
                          {' '}<span className="font-semibold">{operators.find(o => o.value === question.conditionalLogic.showIf.operator)?.label}</span>{' '}
                          "<span className="font-semibold">{question.conditionalLogic.showIf.value}</span>"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Preview Component with Working File Upload
function PreviewQuestion({ question, qIdx }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Selected file:', file);

    setIsUploading(true);
    setUploadError('');

    // Simple validation first
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a PDF file (.pdf)');
      setIsUploading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Please select a file smaller than 10MB');
      setIsUploading(false);
      return;
    }

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const fileInfo = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      };

      setValue(fileInfo);
      setError('');
      console.log('File uploaded successfully:', fileInfo);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed: ' + error.message);
      setError('Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeFile = () => {
    setValue(null);
    setError('');
  };

  const handleTextChange = (newValue) => {
    setValue(newValue);

    // Validate text length
    if (question.validation?.maxLength && newValue.length > question.validation.maxLength) {
      setError(question.validation.errorMessage || `Maximum ${question.validation.maxLength} characters allowed`);
    } else if (question.type === 'numeric' && newValue !== '') {
      const numValue = Number(newValue);
      if (question.validation?.min !== null && numValue < question.validation.min) {
        setError(question.validation.errorMessage || `Must be at least ${question.validation.min}`);
      } else if (question.validation?.max !== null && numValue > question.validation.max) {
        setError(question.validation.errorMessage || `Must be at most ${question.validation.max}`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  return (
    <div key={question.id} className="mb-8 last:mb-0">
      <label className="block text-base font-semibold text-gray-900 mb-3">
        {qIdx + 1}. {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
        {question.conditionalLogic?.enabled && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Conditional</span>
        )}
      </label>

      {question.type === 'short-text' && (
        <div>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            placeholder="Your answer"
            maxLength={question.validation?.maxLength}
          />
          <div className="flex justify-between items-center mt-2">
            {question.validation?.maxLength && (
              <div className={`text-xs ${value?.length > question.validation.maxLength ? 'text-red-600' : 'text-gray-500'
                }`}>
                {value?.length || 0}/{question.validation.maxLength}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-xs flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {error}
              </div>
            )}
            {value && !error && question.validation?.maxLength && value.length <= question.validation.maxLength && (
              <div className="text-green-600 text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Valid
              </div>
            )}
          </div>
        </div>
      )}

      {question.type === 'long-text' && (
        <div>
          <textarea
            rows="4"
            value={value || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none transition-all ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            placeholder="Your answer"
            maxLength={question.validation?.maxLength}
          />
          <div className="flex justify-between items-center mt-2">
            {question.validation?.maxLength && (
              <div className={`text-xs ${value?.length > question.validation.maxLength ? 'text-red-600' : 'text-gray-500'
                }`}>
                {value?.length || 0}/{question.validation.maxLength}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-xs flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {error}
              </div>
            )}
            {value && !error && question.validation?.maxLength && value.length <= question.validation.maxLength && (
              <div className="text-green-600 text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Valid
              </div>
            )}
          </div>
        </div>
      )}

      {question.type === 'single-choice' && (
        <div className="space-y-3">
          {(question.options || []).map((option, oIdx) => (
            <label key={oIdx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent hover:border-gray-200">
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={value === option}
                onChange={() => setValue(option)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="text-gray-700 text-base">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'multi-choice' && (
        <div className="space-y-3">
          {(question.options || []).map((option, oIdx) => (
            <label key={oIdx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent hover:border-gray-200">
              <input
                type="checkbox"
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(e) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  const newValues = e.target.checked
                    ? [...currentValues, option]
                    : currentValues.filter(opt => opt !== option);
                  setValue(newValues);
                }}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-base">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'numeric' && (
        <div>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            placeholder="Enter a number"
            min={question.validation?.min}
            max={question.validation?.max}
          />
          {error && (
            <div className="text-red-600 text-xs flex items-center gap-1 mt-2">
              <XCircle className="w-3 h-3" />
              {error}
            </div>
          )}
          {value && !error && (
            <div className="text-green-600 text-xs flex items-center gap-1 mt-2">
              <CheckCircle className="w-3 h-3" />
              Valid input
            </div>
          )}
        </div>
      )}

      {question.type === 'file-upload' && (
        <div className="space-y-4">
          {/* File Input */}
          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${uploadError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
            }`}>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id={`file-${question.id}`}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={isUploading}
            />
            <label
              htmlFor={`file-${question.id}`}
              className={`cursor-pointer block ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-600">Uploading PDF...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload PDF or drag and drop</p>
                  <p className="text-gray-400 text-sm">PDF files only (max 10MB)</p>
                  <p className="text-blue-500 text-xs mt-2">Supported: .pdf</p>
                </>
              )}
            </label>
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {uploadError}
              </p>
              <p className="text-red-600 text-xs mt-1">
                Please select a valid PDF file (max 10MB)
              </p>
            </div>
          )}

          {/* File Preview */}
          {value && !isUploading && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 text-sm">{value.fileName}</p>
                    <p className="text-green-600 text-xs">
                      {(value.fileSize / 1024 / 1024).toFixed(2)} MB • PDF Document
                    </p>
                    <p className="text-green-500 text-xs">✓ Successfully uploaded</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Debug Info (remove in production) */}
          {value && (
            <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
              <p>File Type: {value.fileType}</p>
              <p>Size: {value.fileSize} bytes ({(value.fileSize / 1024 / 1024).toFixed(2)} MB)</p>
              <p>Uploaded: {new Date(value.uploadedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssessmentBuilderPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch job data
  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const jobData = await db.jobs.get(parseInt(jobId));
      if (!jobData) {
        throw new Error('Job not found');
      }
      return jobData;
    }
  });

  // Fetch assessment data
  const { data: assessment, isLoading: assessmentLoading } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: async () => {
      let assessmentData = await db.assessments.get(parseInt(jobId));

      if (!assessmentData) {
        // Create default assessment structure
        assessmentData = {
          id: parseInt(jobId),
          jobId: parseInt(jobId),
          title: `${job?.title || 'Job'} Assessment`,
          description: `Assessment for ${job?.title || 'this position'}`,
          duration: 60,
          sections: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      return assessmentData;
    },
    enabled: !!jobId
  });

  const [localAssessment, setLocalAssessment] = useState({
    jobId: jobId || 'demo-job',
    sections: []
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when assessment loads
  useEffect(() => {
    if (assessment) {
      setLocalAssessment(assessment);
      const expanded = {};
      assessment.sections.forEach((_, idx) => {
        expanded[idx] = true;
      });
      setExpandedSections(expanded);
    }
  }, [assessment]);

  // Save assessment mutation
  const saveMutation = useMutation({
    mutationFn: async (assessmentData) => {
      return await db.assessments.put({
        ...assessment,
        ...assessmentData,
        updatedAt: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment', jobId]);
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Error saving assessment:', error);
      setIsSaving(false);
      alert('Failed to save assessment');
    }
  });

  const saveAssessment = async () => {
    setIsSaving(true);
    saveMutation.mutate(localAssessment);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${localAssessment.sections.length + 1}`,
      description: '',
      questions: []
    };
    setLocalAssessment({
      ...localAssessment,
      sections: [...localAssessment.sections, newSection]
    });
    setExpandedSections({
      ...expandedSections,
      [localAssessment.sections.length]: true
    });
  };

  const updateSection = (sectionIndex, field, value) => {
    const newSections = [...localAssessment.sections];
    newSections[sectionIndex][field] = value;
    setLocalAssessment({ ...localAssessment, sections: newSections });
  };

  const deleteSection = (sectionIndex) => {
    const newSections = localAssessment.sections.filter((_, idx) => idx !== sectionIndex);
    setLocalAssessment({ ...localAssessment, sections: newSections });
  };

  const addQuestion = (sectionIndex) => {
    const newQuestion = {
      id: Date.now(),
      type: 'short-text',
      question: '',
      required: false,
      options: [],
      validation: getDefaultValidation('short-text'),
      conditionalLogic: {
        enabled: false,
        showIf: {
          questionId: null,
          operator: 'equals',
          value: ''
        }
      }
    };
    const newSections = [...localAssessment.sections];
    newSections[sectionIndex].questions.push(newQuestion);
    setLocalAssessment({ ...localAssessment, sections: newSections });
  };

  const updateQuestion = (sectionIndex, questionIndex, field, value) => {
    const newSections = [...localAssessment.sections];

    // Handle full replacement
    if (field === 'replace') {
      newSections[sectionIndex].questions[questionIndex] = value;
    } else {
      // Handle field update
      newSections[sectionIndex].questions[questionIndex][field] = value;
    }

    setLocalAssessment({ ...localAssessment, sections: newSections });
  };

  const deleteQuestion = (sectionIndex, questionIndex) => {
    const newSections = [...localAssessment.sections];
    newSections[sectionIndex].questions = newSections[sectionIndex].questions.filter(
      (_, idx) => idx !== questionIndex
    );
    setLocalAssessment({ ...localAssessment, sections: newSections });
  };

  const toggleSection = (index) => {
    setExpandedSections({
      ...expandedSections,
      [index]: !expandedSections[index]
    });
  };

  const questionTypes = [
    { value: 'short-text', label: 'Short Text', icon: Type },
    { value: 'long-text', label: 'Long Text', icon: FileText },
    { value: 'single-choice', label: 'Single Choice', icon: CheckSquare },
    { value: 'multi-choice', label: 'Multiple Choice', icon: List },
    { value: 'numeric', label: 'Numeric', icon: Hash },
    { value: 'file-upload', label: 'File Upload', icon: Upload }
  ];

  const getQuestionIcon = (type) => {
    const typeObj = questionTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Type;
  };

  const estimatedTime = localAssessment.sections.reduce((acc, s) => acc + s.questions.length, 0) * 2;

  if (jobLoading || assessmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assessment builder...</p>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Preview</h1>
              <p className="text-gray-600">See how candidates will experience this assessment</p>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Builder
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
            {localAssessment.sections.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No sections added yet.</p>
                <p className="text-gray-400 text-sm mt-2">Add sections and questions to preview the assessment</p>
              </div>
            ) : (
              localAssessment.sections.map((section, sIdx) => (
                <div key={section.id} className="mb-12 last:mb-0">
                  <div className="border-l-4 border-blue-500 pl-6 mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h2>
                    {section.description && (
                      <p className="text-gray-600 text-lg">{section.description}</p>
                    )}
                  </div>

                  {section.questions.map((question, qIdx) => (
                    <PreviewQuestion
                      key={question.id}
                      question={question}
                      qIdx={qIdx}
                    />
                  ))}
                </div>
              ))
            )}

            {localAssessment.sections.length > 0 && (
              <button className="w-full mt-10 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/assessments')}
                className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Assessments
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Builder</h1>
              <p className="text-gray-500 mt-1">Job: {job?.title || 'Loading...'}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2 font-medium shadow-sm"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={saveAssessment}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
                  <p className="text-gray-500 text-sm mt-1">Organize your assessment into logical sections</p>
                </div>
                <button
                  onClick={addSection}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>

              {localAssessment.sections.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <FileText className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No sections yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Click "Add Section" to start building your assessment. You can add multiple sections to organize questions by topic.</p>
                  <button
                    onClick={addSection}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all inline-flex items-center gap-2 font-medium shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {localAssessment.sections.map((section, sIdx) => (
                    <div key={section.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all bg-white shadow-sm">
                      {/* Section Header */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="cursor-move hover:bg-white p-2 rounded-lg transition-colors">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(sIdx, 'title', e.target.value)}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-900 transition-all bg-white"
                            placeholder="Section Title"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSection(sIdx)}
                            className="p-2.5 hover:bg-white rounded-lg transition-all"
                          >
                            {expandedSections[sIdx] ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteSection(sIdx)}
                            className="p-2.5 hover:bg-red-50 rounded-lg text-red-600 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Section Content */}
                      {expandedSections[sIdx] && (
                        <div className="p-6 space-y-5 bg-gray-50">
                          <textarea
                            value={section.description}
                            onChange={(e) => updateSection(sIdx, 'description', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                            placeholder="Section description (optional)"
                            rows="2"
                          />

                          {/* Questions */}
                          {section.questions.map((question, qIdx) => (
                            <QuestionEditorWithConditional
                              key={question.id}
                              question={question}
                              onChange={(updated) => updateQuestion(sIdx, qIdx, 'replace', updated)}
                              onDelete={() => deleteQuestion(sIdx, qIdx)}
                              allQuestions={section.questions}
                              sectionIndex={sIdx}
                              questionIndex={qIdx}
                            />
                          ))}

                          <button
                            onClick={() => addQuestion(sIdx)}
                            className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Add Question
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assessment Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sections</span>
                  <span className="font-semibold text-gray-900">{localAssessment.sections.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold text-gray-900">
                    {localAssessment.sections.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Required Questions</span>
                  <span className="font-semibold text-gray-900">
                    {localAssessment.sections.reduce((acc, s) => acc + s.questions.filter(q => q.required).length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conditional Questions</span>
                  <span className="font-semibold text-gray-900">
                    {localAssessment.sections.reduce((acc, s) => acc + s.questions.filter(q => q.conditionalLogic?.enabled).length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Questions with Validation</span>
                  <span className="font-semibold text-gray-900">
                    {localAssessment.sections.reduce((acc, s) => acc + s.questions.filter(q =>
                      q.validation && (q.validation.min !== null || q.validation.max !== null || q.validation.maxLength)
                    ).length, 0)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated Time</span>
                    <span className="font-semibold text-gray-900">{estimatedTime} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Types Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Question Types</h3>
              <div className="space-y-3">
                {questionTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.value} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Use sections to group related questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Mark essential questions as required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Use validation rules for better data quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Use conditional logic for dynamic flows</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Preview before saving</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}