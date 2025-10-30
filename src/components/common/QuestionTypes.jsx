import { useState, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, FileText, Trash2 } from 'lucide-react';
import { handleFileUpload } from '../../utils/fileUpload';

export const QuestionTypes = {
  'short-text': ({ question, value, onChange, onValidation }) => {
    const [error, setError] = useState('');

    useEffect(() => {
      // Validate on value change
      if (value && question.validation?.maxLength && value.length > question.validation.maxLength) {
        setError(question.validation.errorMessage || `Maximum ${question.validation.maxLength} characters allowed`);
        onValidation?.(false);
      } else {
        setError('');
        onValidation?.(true);
      }
    }, [value, question.validation]);

    return (
      <div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
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
    );
  },

  'long-text': ({ question, value, onChange, onValidation }) => {
    const [error, setError] = useState('');

    useEffect(() => {
      if (value && question.validation?.maxLength && value.length > question.validation.maxLength) {
        setError(question.validation.errorMessage || `Maximum ${question.validation.maxLength} characters allowed`);
        onValidation?.(false);
      } else {
        setError('');
        onValidation?.(true);
      }
    }, [value, question.validation]);

    return (
      <div>
        <textarea
          rows="4"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
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
    );
  },

  'numeric': ({ question, value, onChange, onValidation }) => {
    const [error, setError] = useState('');

    useEffect(() => {
      if (value !== '' && value !== null && value !== undefined) {
        const numValue = Number(value);
        const val = question.validation || {};

        if (val.min !== null && numValue < val.min) {
          setError(val.errorMessage || `Must be at least ${val.min}`);
          onValidation?.(false);
        } else if (val.max !== null && numValue > val.max) {
          setError(val.errorMessage || `Must be at most ${val.max}`);
          onValidation?.(false);
        } else {
          setError('');
          onValidation?.(true);
        }
      } else {
        setError('');
        onValidation?.(true);
      }
    }, [value, question.validation]);

    return (
      <div>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
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
    );
  },

  'single-choice': ({ question, value, onChange, onValidation }) => {
    return (
      <div className="space-y-3">
        {(question.options || []).map((option, oIdx) => (
          <label key={oIdx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent hover:border-gray-200">
            <input
              type="radio"
              name={`q-${question.id}`}
              checked={value === option}
              onChange={() => onChange(option)}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-700 text-base">{option}</span>
          </label>
        ))}
      </div>
    );
  },

  'multi-choice': ({ question, value, onChange, onValidation }) => {
    const handleOptionChange = (option, checked) => {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = checked
        ? [...currentValues, option]
        : current.filter(opt => opt !== option);
      onChange(newValues);
    };

    return (
      <div className="space-y-3">
        {(question.options || []).map((option, oIdx) => (
          <label key={oIdx} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border-2 border-transparent hover:border-gray-200">
            <input
              type="checkbox"
              checked={Array.isArray(value) && value.includes(option)}
              onChange={(e) => handleOptionChange(option, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-gray-700 text-base">{option}</span>
          </label>
        ))}
      </div>
    );
  },

  'file-upload': ({ question, value, onChange, onValidation }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      setUploadError('');

      try {
        const fileInfo = await handleFileUpload(file);
        onChange(fileInfo);
        onValidation?.(true);
      } catch (error) {
        setUploadError(error.message);
        onValidation?.(false);
      } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = '';
      }
    };

    const removeFile = () => {
      onChange(null);
      onValidation?.(false);
    };

    return (
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
                <p className="text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-400 text-sm">PDF, DOC, DOCX (max 10MB)</p>
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
                    {(value.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(value.uploadedAt).toLocaleDateString()}
                  </p>
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
      </div>
    );
  }
};