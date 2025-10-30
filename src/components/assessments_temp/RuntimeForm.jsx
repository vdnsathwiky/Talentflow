
import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";

export default function RuntimeForm({ assessment, onSubmit }) {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    assessment.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.required && !responses[question.id]) {
          newErrors[question.id] = "This field is required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(`question-${firstError}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    await onSubmit(responses);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {assessment.sections.map((section) => (
        <div key={section.id} className="border-l-4 border-blue-500 pl-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {section.title}
          </h3>
          {section.description && (
            <p className="text-gray-600 mb-6">{section.description}</p>
          )}

          <div className="space-y-6">
            {section.questions.map((question, idx) => (
              <div
                key={question.id}
                id={`question-${question.id}`}
                className="scroll-mt-24"
              >
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  {idx + 1}. {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {question.type === "short-text" && (
                  <input
                    type="text"
                    value={responses[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors[question.id]
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                    placeholder="Your answer"
                  />
                )}

                {question.type === "long-text" && (
                  <textarea
                    rows="5"
                    value={responses[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors[question.id]
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                    placeholder="Your answer"
                  />
                )}

                {question.type === "single-choice" && (
                  <div className="space-y-3">
                    {(question.options || []).map((option, oIdx) => (
                      <label
                        key={oIdx}
                        className={`flex items-center space-x-3 cursor-pointer p-4 rounded-xl transition-all border-2 ${responses[question.id] === option
                          ? "bg-blue-50 border-blue-500"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={responses[question.id] === option}
                          onChange={() => handleChange(question.id, option)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-700 text-base font-medium">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "multi-choice" && (
                  <div className="space-y-3">
                    {(question.options || []).map((option, oIdx) => {
                      const selected = responses[question.id] || [];
                      const isChecked = selected.includes(option);

                      return (
                        <label
                          key={oIdx}
                          className={`flex items-center space-x-3 cursor-pointer p-4 rounded-xl transition-all border-2 ${isChecked
                            ? "bg-blue-50 border-blue-500"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newSelected = e.target.checked
                                ? [...selected, option]
                                : selected.filter((s) => s !== option);
                              handleChange(question.id, newSelected);
                            }}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="text-gray-700 text-base font-medium">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {question.type === "numeric" && (
                  <input
                    type="number"
                    value={responses[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors[question.id]
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                    placeholder="Enter a number"
                  />
                )}

                {question.type === "file-upload" && (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer ${errors[question.id]
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  >
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-400 text-sm">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                )}

                {errors[question.id] && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="font-medium">⚠</span> {errors[question.id]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Submit Assessment
            </>
          )}
        </button>
      </div>
    </form>
  );
}